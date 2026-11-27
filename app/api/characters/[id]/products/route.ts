import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await prisma.product.findMany({
    where: { characterId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, type, imageUrl } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "商品名は必須です" }, { status: 400 });
  const character = await prisma.character.findUnique({ where: { id } });
  const authorStatus = character?.requiresAuthorReview ? "PENDING" : "NOT_REQUIRED";
  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      type,
      status: "PENDING",
      authorStatus,
      imageUrl: imageUrl || null,
      characterId: id,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
