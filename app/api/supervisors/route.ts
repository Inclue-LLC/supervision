import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supervisors = await prisma.supervisor.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(supervisors);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "氏名は必須です" }, { status: 400 });
  }
  const supervisor = await prisma.supervisor.create({ data: { name } });
  return NextResponse.json(supervisor, { status: 201 });
}
