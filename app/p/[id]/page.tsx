import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PastePage({ params }: PageProps) {
  // ✅ UNWRAP PARAMS
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    notFound();
  }

  const now = new Date();

  // TTL check
  if (paste.expiresAt && paste.expiresAt <= now) {
    notFound();
  }

  // View limit check
  if (paste.maxViews !== null && paste.viewsUsed >= paste.maxViews) {
    notFound();
  }

  // Increment view count
  await prisma.paste.update({
    where: { id },
    data: {
      viewsUsed: { increment: 1 },
    },
  });

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "4px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
