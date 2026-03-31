import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      supervisor: true,
      contents: { orderBy: { createdAt: "desc" } },
      comments: {
        include: { supervisor: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "案件が見つかりません" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, clientName, deadline, status, supervisorId } = body;

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      clientName,
      deadline: deadline ? new Date(deadline) : null,
      status,
      supervisorId: supervisorId || null,
    },
    include: { supervisor: true },
  });

  return NextResponse.json(project);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
