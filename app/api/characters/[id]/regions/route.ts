import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const regions = await prisma.region.findMany({
    where: { characterId: id },
    include: { _count: { select: { licensees: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(regions);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "地域名は必須です" }, { status: 400 });
  const region = await prisma.region.create({ data: { name: name.trim(), characterId: id } });
  return NextResponse.json(region, { status: 201 });
}
