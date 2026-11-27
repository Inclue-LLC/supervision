import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      character: { select: { id: true, name: true, requiresAuthorReview: true } },
      licensee: { select: { id: true, name: true } },
      stages: { orderBy: { stageType: "asc" } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
      ...(data.characterId !== undefined && { characterId: data.characterId }),
      ...(data.licenseeId !== undefined && { licenseeId: data.licenseeId || null }),
    },
    include: {
      character: { select: { id: true, name: true, requiresAuthorReview: true } },
      licensee: { select: { id: true, name: true } },
      stages: { orderBy: { stageType: "asc" } },
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
