import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  // Vercel Blob クライアントアップロードプロトコル (JSON)
  if (contentType.includes("application/json")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN が設定されていません" },
        { status: 500 }
      );
    }
    const body = (await req.json()) as HandleUploadBody;
    try {
      const response = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: [
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        }),
        onUploadCompleted: async ({ blob }) => {
          console.log("Upload completed:", blob.url);
        },
      });
      return NextResponse.json(response);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("handleUpload error:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  // ローカル開発用フォールバック (FormData)
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
      { error: "本番環境では Vercel Blob の設定が必要です" },
      { status: 500 }
    );
  }
}
