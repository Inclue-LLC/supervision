import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string; regionId: string; licenseeId: string }> }) {
  const { licenseeId } = await params;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "ライセンシー名は必須です" }, { status: 400 });
  const licensee = await prisma.licensee.update({ where: { id: licenseeId }, data: { name: name.trim() } });
  return NextResponse.json(licensee);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; regionId: string; licenseeId: string }> }) {
  const { licenseeId } = await params;
  await prisma.licensee.delete({ where: { id: licenseeId } });
  return new NextResponse(null, { status: 204 });
}
