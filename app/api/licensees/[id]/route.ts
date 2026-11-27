import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();
  const licensee = await prisma.licensee.update({
    where: { id },
    data: { name: name.trim() },
  });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json(licensee);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.licensee.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json({ ok: true });
}
