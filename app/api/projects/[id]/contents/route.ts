import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const body = await req.json();
  const { title, body: contentBody } = body;

  if (!title) {
    return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
  }

  const content = await prisma.content.create({
    data: { title, body: contentBody, projectId },
  });

  return NextResponse.json(content, { status: 201 });
}
