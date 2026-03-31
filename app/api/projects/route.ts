import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { supervisor: true, contents: true, _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, clientName, deadline, supervisorId } = body;

  if (!title) {
    return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      clientName,
      deadline: deadline ? new Date(deadline) : undefined,
      supervisorId: supervisorId || undefined,
    },
    include: { supervisor: true },
  });

  return NextResponse.json(project, { status: 201 });
}
