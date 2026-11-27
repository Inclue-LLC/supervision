import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const characters = await prisma.character.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(characters);
}

export async function POST(req: NextRequest) {
  const { name, requiresAuthorReview } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  const character = await prisma.character.create({
    data: { name: name.trim(), requiresAuthorReview: !!requiresAuthorReview },
  });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json(character, { status: 201 });
}
