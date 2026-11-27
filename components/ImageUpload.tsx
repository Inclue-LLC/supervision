"use client";

import { useState, useCallback } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  values: string[];
  onChange: (urls: string[]) => void;
};

export default function ImageUpload({ values, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("画像ファイル（JPG・PNG・GIF・WebP等）のみアップロードできます");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      onChange([...values, blob.url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      Array.from(e.dataTransfer.files).forEach(uploadFile);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).forEach(uploadFile);
    e.target.value = "";
  };

  function removeImage(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`画像 ${i + 1}`}
                className="w-32 h-32 object-contain rounded-xl border border-gray-200 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl transition-colors ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        <label className="flex flex-col items-center justify-center h-24 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleChange}
          />
          {uploading ? (
            <span className="text-sm text-gray-500">アップロード中...</span>
          ) : (
            <>
              <span className="text-2xl mb-1">🖼️</span>
              <span className="text-sm text-gray-500">
                {values.length > 0 ? "さらに画像を追加" : "画像をドラッグ&ドロップ、またはクリックして選択"}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">JPG・PNG・GIF・WebP（複数可）</span>
            </>
          )}
        </label>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
