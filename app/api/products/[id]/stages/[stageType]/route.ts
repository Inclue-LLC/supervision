import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stageType: string }> }
) {
  const { id: productId, stageType } = await params;
  const data = await req.json();

  const stage = await prisma.reviewStage.upsert({
    where: { productId_stageType: { productId, stageType: stageType as any } },
    create: {
      productId,
      stageType: stageType as any,
      satoStatus: data.satoStatus ?? "PENDING",
      satoNote: data.satoNote ?? null,
      authorStatus: data.authorStatus ?? "NOT_REQUIRED",
      authorNote: data.authorNote ?? null,
      fileUrl: data.fileUrl ?? null,
    },
    update: {
      ...(data.satoStatus !== undefined && { satoStatus: data.satoStatus }),
      ...(data.satoNote !== undefined && { satoNote: data.satoNote }),
      ...(data.authorStatus !== undefined && { authorStatus: data.authorStatus }),
      ...(data.authorNote !== undefined && { authorNote: data.authorNote }),
      ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl }),
    },
  });

  await prisma.product.update({ where: { id: productId }, data: {} });

  return NextResponse.json(stage);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; stageType: string }> }
) {
  const { id: productId, stageType } = await params;
  await prisma.reviewStage.deleteMany({
    where: { productId, stageType: stageType as any },
  });
  return NextResponse.json({ ok: true });
}
