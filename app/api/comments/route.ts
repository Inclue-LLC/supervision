import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { body: commentBody, supervisorId, projectId, contentId } = body;

  if (!commentBody) {
    return NextResponse.json({ error: "コメント内容は必須です" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: commentBody,
      supervisorId: supervisorId || undefined,
      projectId: projectId || undefined,
      contentId: contentId || undefined,
    },
    include: { supervisor: true },
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
  }

  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
