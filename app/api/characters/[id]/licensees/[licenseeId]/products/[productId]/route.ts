import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string; productId: string }> }
) {
  const { productId } = await params;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      comments: {
        include: { supervisor: true },
        orderBy: { createdAt: "desc" },
      },
      licensee: { include: { character: true } },
    },
  });
  if (!product) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string; productId: string }> }
) {
  const { productId } = await params;
  const { name, type, status, imageUrl } = await req.json();
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(status !== undefined && { status }),
      ...(imageUrl !== undefined && { imageUrl }),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string; productId: string }> }
) {
  const { productId } = await params;
  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ ok: true });
}
