import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string }> }
) {
  const { licenseeId } = await params;
  const { name, type, imageUrl } = await req.json();
  if (!name || !type) {
    return NextResponse.json({ error: "商品名と監修区分は必須です" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: { name, type, imageUrl, licenseeId },
  });
  return NextResponse.json(product, { status: 201 });
}
