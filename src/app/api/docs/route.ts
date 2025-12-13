import { discoverTopics } from "@/lib/docs";

export async function GET() {
    const topics = discoverTopics();
    return Response.json(topics);
}