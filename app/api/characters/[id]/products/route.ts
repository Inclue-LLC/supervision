import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const products = await prisma.product.findMany({
    where: { characterId: id },
    include: { comments: { include: { supervisor: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, type, status, imageUrl } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "商品名は必須です" }, { status: 400 });
  const product = await prisma.product.create({
    data: { name: name.trim(), type, status: status ?? "PENDING", imageUrl: imageUrl || null, characterId: id },
  });
  return NextResponse.json(product, { status: 201 });
}
