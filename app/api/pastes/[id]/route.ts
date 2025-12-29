import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 1️⃣ Extract ID from URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 2️⃣ Find paste
    const paste = await prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = new Date();

    // 3️⃣ TTL check
    if (paste.expiresAt && paste.expiresAt <= now) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 4️⃣ View limit check
    if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 5️⃣ Increment views
    const updated = await prisma.paste.update({
      where: { id },
      data: {
        viewsUsed: { increment: 1 },
      },
    });

    const remainingViews =
      updated.maxViews !== null
        ? Math.max(updated.maxViews - updated.viewsUsed, 0)
        : null;

    // 6️⃣ Return response
    return NextResponse.json(
      {
        content: updated.content,
        remaining_views: remainingViews,
        expires_at: updated.expiresAt,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
