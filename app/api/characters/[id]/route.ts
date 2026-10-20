import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      inhouseProducts: { include: { comments: true }, orderBy: { createdAt: "asc" } },
      regions: {
        include: {
          licensees: {
            include: { _count: { select: { products: true } } },
            orderBy: { createdAt: "asc" },
          },
          _count: { select: { licensees: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!character) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(character);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  const character = await prisma.character.update({ where: { id }, data: { name: name.trim() } });
  return NextResponse.json(character);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.character.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
