import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      include: { storyItems: true },
    });
    if (!stories.length) {
      return NextResponse.json({ error: "Нет историй" }, { status: 404 });
    }
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Server error [API_STORIES]", error);
    return NextResponse.json({ error });
  }
}
