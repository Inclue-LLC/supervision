import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルは必須です" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "画像ファイルのみ対応しています" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, file, { access: "public" });
      return NextResponse.json({ url: blob.url }, { status: 201 });
    } catch (e) {
      console.error("Blob upload error:", e);
      return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }
  }

  // ローカル開発用フォールバック
  try {
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "本番環境では Vercel Blob の設定が必要です。Vercel ダッシュボードの Storage タブから Blob を作成してプロジェクトに接続してください。" },
      { status: 500 }
    );
  }
}
