import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; regionId: string }> }) {
  const { regionId } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "地域名は必須です" }, { status: 400 });
  const region = await prisma.region.update({ where: { id: regionId }, data: { name: name.trim() } });
  return NextResponse.json(region);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; regionId: string }> }) {
  const { regionId } = await params;
  await prisma.region.delete({ where: { id: regionId } });
  return new NextResponse(null, { status: 204 });
}
