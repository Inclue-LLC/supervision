import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const characters = await prisma.character.findMany({
    include: { _count: { select: { licensees: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(characters);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name } = body;
  if (!name) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  const character = await prisma.character.create({ data: { name } });
  return NextResponse.json(character, { status: 201 });
}
