import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const expiresAt =
      typeof ttl_seconds === "number"
        ? new Date(Date.now() + ttl_seconds * 1000)
        : null;

    const paste = await prisma.paste.create({
      data: {
        content,
        expiresAt,
        maxViews:
          typeof max_views === "number" ? max_views : null,
      },
    });

    return NextResponse.json({
      id: paste.id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/p/${paste.id}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
