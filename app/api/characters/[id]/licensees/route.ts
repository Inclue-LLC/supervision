import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: characterId } = await params;
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "会社名は必須です" }, { status: 400 });
  }
  const licensee = await prisma.licensee.create({
    data: { name, characterId },
  });
  return NextResponse.json(licensee, { status: 201 });
}
