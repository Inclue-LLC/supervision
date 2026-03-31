import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supervisors = await prisma.supervisor.findMany({
    include: { _count: { select: { projects: true, comments: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(supervisors);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, affiliation, specialty, bio } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "氏名とメールは必須です" }, { status: 400 });
  }

  const supervisor = await prisma.supervisor.create({
    data: { name, email, affiliation, specialty, bio },
  });

  return NextResponse.json(supervisor, { status: 201 });
}
