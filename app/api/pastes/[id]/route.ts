import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const paste = await prisma.paste.findUnique({
      where: { id: params.id },
    });

    if (!paste) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null
          ? paste.maxViews - paste.viewsUsed
          : null,
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
