import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { body, supervisorId, productId } = await req.json();
  if (!body || !productId) {
    return NextResponse.json({ error: "コメントと商品IDは必須です" }, { status: 400 });
  }
  const comment = await prisma.comment.create({
    data: { body, productId, supervisorId: supervisorId || undefined },
    include: { supervisor: true },
  });
  return NextResponse.json(comment, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "IDは必須です" }, { status: 400 });
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
