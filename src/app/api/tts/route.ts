import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { getDocBySlug } from "@/lib/docs";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const polly = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || "explainbyits-audio-bucket";

// Helper to strip MDX tags and formatting into plain speakable text
function mdxToPlainText(mdx: string): string {
  if (!mdx) return "";

  let text = mdx;

  // 1. Remove Frontmatter (starts and ends with ---)
  text = text.replace(/^---[\s\S]*?---/, "");

  // 2. Remove code blocks (```lang ... ```)
  text = text.replace(/```[\s\S]*?```/g, "");

  // 3. Remove inline code backticks (`code`) but keep the text
  text = text.replace(/`([^`]+)`/g, "$1");

  // 4. Remove HTML / Custom React components (e.g. <Quiz ... /> or <Quiz>...</Quiz>)
  // Remove Mermaid components specifically because they contain arrows (e.g. "-->") which break generic tag stripping
  text = text.replace(/<Mermaid\b[\s\S]*?\/>/g, "");
  text = text.replace(/<[A-Z][a-zA-Z0-9]*\b[^>]*\/>/g, "");
  text = text.replace(/<([A-Z][a-zA-Z0-9]*)\b[^>]*>([\s\S]*?)<\/ \1>/g, "");
  text = text.replace(/<([A-Z][a-zA-Z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, "");
  text = text.replace(/<\/?[A-Z][a-zA-Z0-9]*\b[^>]*>/g, "");

  // 5. For standard HTML tags, strip the tags but keep the content
  text = text.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/g, "");

  // 5.5. Parse Markdown tables: remove separators and turn pipes into readable commas
  // Remove table separator lines (e.g. |---|---| or | :--- | :--- |)
  text = text.replace(/^\s*\|?[\s\-:|]+\|?\s*$/gm, "");
  // Remove leading and trailing pipes on each line
  text = text.replace(/^\s*\|\s*/gm, "");
  text = text.replace(/\s*\|\s*$/gm, "");
  // Replace remaining inner pipes with a comma and space for natural speech pause
  text = text.replace(/\s*\|\s*/g, ", ");

  // 6. Remove Markdown images: ![alt](url)
  text = text.replace(/!\[.*?\]\(.*?\)/g, "");

  // 7. Remove Markdown links: [text](url) -> keep text
  text = text.replace(/\[(.*?)\]\(.*?\)/g, "$1");

  // 8. Remove emphasis and bold markers: **text** or __text__ or *text* or _text_ -> text
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");

  // 9. Remove headers markers: #, ##, ### etc.
  text = text.replace(/^#+\s+/gm, "");

  // 10. Remove blockquote markers: >
  text = text.replace(/^\s*>\s+/gm, "");

  // 11. Remove bullet list markers: *, -, + and numbers: 1.
  text = text.replace(/^\s*[*\-+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // 12. Replace HTML entities with plain text characters
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&apos;": "'",
  };
  text = text.replace(/&[a-z]+;/g, (match) => entities[match] || match);

  // 13. Remove horizontal rules: --- or ***
  text = text.replace(/^\s*[-*_]{3,}\s*$/gm, "");

  // 14. Clean up multiple newlines/whitespace
  text = text.replace(/\n\s*\n/g, "\n\n");
  text = text.trim();

  return text;
}

// Split text into chunks that fit within the Polly limit (neural engine limit is 3,000 billed chars)
function splitTextIntoChunks(text: string, maxChunkSize = 2500): string[] {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    if (text.length - currentIndex <= maxChunkSize) {
      chunks.push(text.slice(currentIndex));
      break;
    }

    const endOfChunk = currentIndex + maxChunkSize;
    const searchArea = text.slice(currentIndex, endOfChunk);

    let splitIndex = -1;
    const match = /[.!?](\s+|$)/.exec(searchArea);
    if (match) {
      let lastIndex = -1;
      let pos = searchArea.search(/[.!?](\s+|$)/);
      while (pos !== -1) {
        lastIndex = pos;
        const remaining = searchArea.slice(pos + 1);
        const nextPos = remaining.search(/[.!?](\s+|$)/);
        if (nextPos === -1) break;
        pos = pos + 1 + nextPos;
      }
      if (lastIndex !== -1) {
        splitIndex = lastIndex + 1;
      }
    }

    if (splitIndex === -1) {
      splitIndex = searchArea.lastIndexOf(" ");
    }

    if (splitIndex === -1 || splitIndex === 0) {
      splitIndex = maxChunkSize;
    }

    chunks.push(text.slice(currentIndex, currentIndex + splitIndex));
    currentIndex += splitIndex;

    while (currentIndex < text.length && /\s/.test(text[currentIndex])) {
      currentIndex++;
    }
  }

  return chunks;
}

export async function POST(request: Request) {
  try {
    const { text, slug, topic } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    let mdxContent = text || "";
    if (!mdxContent && topic) {
      const doc = getDocBySlug(topic, slug);
      if (doc) {
        mdxContent = doc.content;
      }
    }

    if (!mdxContent) {
      return NextResponse.json(
        { error: "Content text could not be resolved or found" },
        { status: 400 },
      );
    }

    const plainText = mdxToPlainText(mdxContent);
    if (!plainText) {
      return NextResponse.json(
        { error: "Text content is empty after cleaning MDX" },
        { status: 400 },
      );
    }

    // Use a unique file name for this topic/slug
    const sanitizedSlug = slug.replace(/\//g, "-");
    const s3Key = `tts/${topic ? `${topic}-` : ""}${sanitizedSlug}.mp3`;

    // 1. Check if the audio file already exists in S3
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key }));

      // File exists! Generate a secure signed URL so the user can stream it directly from S3
      const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
      const audioUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Valid for 1 hour

      return NextResponse.json({ audioUrl, cached: true });
    } catch (s3Error) {
      if (
        s3Error &&
        typeof s3Error === "object" &&
        "name" in s3Error &&
        (s3Error as { name: string }).name !== "NotFound"
      ) {
        throw s3Error;
      }
    }

    // 2. Cache Miss: Split into chunks to respect AWS Polly character limits
    const textChunks = splitTextIntoChunks(plainText);
    const audioBuffers: Buffer[] = [];

    for (const chunk of textChunks) {
      const pollyCommand = new SynthesizeSpeechCommand({
        Engine: "generative",
        OutputFormat: "mp3",
        Text: chunk,
        VoiceId: "Stephen",
      });

      const pollyResponse = await polly.send(pollyCommand);

      if (pollyResponse.AudioStream) {
        const chunkBuffer = Buffer.from(
          await pollyResponse.AudioStream.transformToByteArray(),
        );
        audioBuffers.push(chunkBuffer);
      } else {
        throw new Error("Failed to generate audio stream chunk");
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any audio streams" },
        { status: 500 },
      );
    }

    // Concatenate all buffer chunks into one MP3
    const combinedBuffer = Buffer.concat(audioBuffers);

    // 3. Save the generated audio buffer to S3 for future requests
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: combinedBuffer,
        ContentType: "audio/mpeg",
      }),
    );

    // Generate a signed URL for the newly created file
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key });
    const audioUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ audioUrl, cached: false });
  } catch (error) {
    console.error("TTS Processing Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
