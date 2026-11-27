import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const licensees = await prisma.licensee.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(licensees);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
  }
  const licensee = await prisma.licensee.create({
    data: { name: name.trim() },
  });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json(licensee, { status: 201 });
}
