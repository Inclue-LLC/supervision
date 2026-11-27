import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ licenseeId: string }> }) {
  const { licenseeId } = await params;
  const products = await prisma.product.findMany({
    where: { licenseeId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string; regionId: string; licenseeId: string }> }) {
  const { licenseeId } = await params;
  const { name, type, imageUrl } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "商品名は必須です" }, { status: 400 });
  const licensee = await prisma.licensee.findUnique({
    where: { id: licenseeId },
    include: { region: { include: { character: true } } },
  });
  const authorStatus = licensee?.region?.character?.requiresAuthorReview ? "PENDING" : "NOT_REQUIRED";
  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      type,
      status: "PENDING",
      authorStatus,
      imageUrl: imageUrl || null,
      licenseeId,
    },
  });
  return NextResponse.json(product, { status: 201 });
}
