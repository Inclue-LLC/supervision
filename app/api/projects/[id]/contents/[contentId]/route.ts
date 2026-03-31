import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
  const { contentId } = await params;
  const body = await req.json();
  const { title, body: contentBody, status } = body;

  const content = await prisma.content.update({
    where: { id: contentId },
    data: {
      ...(title !== undefined && { title }),
      ...(contentBody !== undefined && { body: contentBody }),
      ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(content);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
  const { contentId } = await params;
  await prisma.content.delete({ where: { id: contentId } });
  return NextResponse.json({ ok: true });
}
