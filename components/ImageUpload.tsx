"use client";

import { useState, useCallback } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
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
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      const data = await res.json();
      setError(data.error ?? "アップロードに失敗しました");
    }
    setUploading(false);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="アップロード画像"
            className="max-w-full max-h-80 rounded-xl border border-gray-200 object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl transition-colors ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />
            {uploading ? (
              <span className="text-sm text-gray-500">アップロード中...</span>
            ) : (
              <>
                <span className="text-3xl mb-2">🖼️</span>
                <span className="text-sm text-gray-500">
                  画像をドラッグ&ドロップ、またはクリックして選択
                </span>
                <span className="text-xs text-gray-400 mt-1">JPG・PNG・GIF・WebP対応</span>
              </>
            )}
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
