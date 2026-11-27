import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const completed = searchParams.get("completed") === "true";

  const products = await prisma.product.findMany({
    where: { isCompleted: completed },
    orderBy: { updatedAt: "desc" },
    include: {
      character: { select: { id: true, name: true, requiresAuthorReview: true } },
      licensee: { select: { id: true, name: true } },
      stages: { select: { stageType: true, satoStatus: true, authorStatus: true } },
    },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const { name, theme, characterId, licenseeId } = await req.json();
  if (!name?.trim() || !characterId) {
    return NextResponse.json({ error: "商品名とキャラクターは必須です" }, { status: 400 });
  }
  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      theme: theme?.trim() || null,
      characterId,
      licenseeId: licenseeId || null,
    },
    include: {
      character: { select: { id: true, name: true, requiresAuthorReview: true } },
      licensee: { select: { id: true, name: true } },
      stages: true,
    },
  });
  revalidatePath("/");
  return NextResponse.json(product, { status: 201 });
}
