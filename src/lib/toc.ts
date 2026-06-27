export interface Heading {
  id: string;
  text: string;
  level: number;
}

// Strip Markdown inline formatting (bold, italic, code, links)
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold **text**
    .replace(/__(.+?)__/g, "$1") // bold __text__
    .replace(/\*(.+?)\*/g, "$1") // italic *text*
    .replace(/_(.+?)_/g, "$1") // italic _text_
    .replace(/`(.+?)`/g, "$1") // inline code `text`
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links [text](url)
    .trim();
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  const idCounts = new Map<string, number>();

  for (const match of content.matchAll(headingRegex)) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = stripMarkdown(rawText);
    const baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const count = idCounts.get(baseId) ?? 0;
    let id = baseId;
    if (count > 0) {
      idCounts.set(baseId, count + 1);
      id = `${baseId}-${count}`;
    } else {
      idCounts.set(baseId, 1);
    }

    headings.push({ id, text, level });
  }

  return headings;
}
