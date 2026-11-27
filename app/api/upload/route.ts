import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルは必須です" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "PDFファイルのみ対応しています" }, { status: 400 });
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
}
