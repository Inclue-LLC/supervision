import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string }> }
) {
  const { licenseeId } = await params;
  const licensee = await prisma.licensee.findUnique({
    where: { id: licenseeId },
    include: {
      character: true,
      products: {
        include: { _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!licensee) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  return NextResponse.json(licensee);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string }> }
) {
  const { licenseeId } = await params;
  const { name } = await req.json();
  const licensee = await prisma.licensee.update({
    where: { id: licenseeId },
    data: { name },
  });
  return NextResponse.json(licensee);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; licenseeId: string }> }
) {
  const { licenseeId } = await params;
  await prisma.licensee.delete({ where: { id: licenseeId } });
  return NextResponse.json({ ok: true });
}
