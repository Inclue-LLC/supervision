import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      licensees: {
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!character) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(character);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name } = await req.json();
  const character = await prisma.character.update({ where: { id }, data: { name } });
  return NextResponse.json(character);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.character.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
