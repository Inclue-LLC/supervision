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
    if (file.type !== "application/pdf") {
      setError("PDFファイルのみアップロードできます");
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
        <div className="relative">
          <embed
            src={value}
            type="application/pdf"
            className="w-full rounded-xl border border-gray-200"
            style={{ height: "360px" }}
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
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleChange}
            />
            {uploading ? (
              <span className="text-sm text-gray-500">アップロード中...</span>
            ) : (
              <>
                <span className="text-3xl mb-2">📄</span>
                <span className="text-sm text-gray-500">
                  PDFをドラッグ&ドロップ、またはクリックして選択
                </span>
              </>
            )}
          </label>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
