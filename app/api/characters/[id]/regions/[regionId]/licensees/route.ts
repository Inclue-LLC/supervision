import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string; regionId: string }> }) {
  const { regionId } = await params;
  const licensees = await prisma.licensee.findMany({
    where: { regionId },
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(licensees);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string; regionId: string }> }) {
  const { regionId } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "ライセンシー名は必須です" }, { status: 400 });
  const licensee = await prisma.licensee.create({ data: { name: name.trim(), regionId } });
  return NextResponse.json(licensee, { status: 201 });
}
