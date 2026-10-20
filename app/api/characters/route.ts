import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const characters = await prisma.character.findMany({
    include: {
      _count: { select: { inhouseProducts: true, regions: true } },
    },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(characters);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  const character = await prisma.character.create({ data: { name: name.trim() } });
  return NextResponse.json(character, { status: 201 });
}
