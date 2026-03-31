import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supervisor = await prisma.supervisor.findUnique({
    where: { id },
    include: {
      projects: { include: { _count: { select: { contents: true } } }, orderBy: { createdAt: "desc" } },
      comments: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!supervisor) {
    return NextResponse.json({ error: "監修者が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(supervisor);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, email, affiliation, specialty, bio } = body;

  const supervisor = await prisma.supervisor.update({
    where: { id },
    data: { name, email, affiliation, specialty, bio },
  });

  return NextResponse.json(supervisor);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.supervisor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
