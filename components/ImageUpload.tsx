"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUpload({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-colors ${
          dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        {value ? (
          <div className="relative">
            <Image
              src={value}
              alt="商品画像"
              width={400}
              height={300}
              className="w-full h-48 object-contain rounded-xl"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-36 cursor-pointer">
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
                  ここにドラッグ&ドロップ、またはクリックして選択
                </span>
                <span className="text-xs text-gray-400 mt-1">JPG / PNG / GIF / WebP</span>
              </>
            )}
          </label>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
