"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import ImageUpload from "./ImageUpload";
import { ReviewType, ReviewStatus, REVIEW_STATUS_LABELS, REVIEW_TYPE_LABELS } from "@/lib/types";

type Product = {
  id: string;
  name: string;
  type: ReviewType;
  status: ReviewStatus;
  imageUrl: string | null;
  createdAt: string;
};

type Props = {
  products: Product[];
  addUrl: string;
};

export default function ProductSection({ products, addUrl }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ReviewType>("DESIGN");
  const [status, setStatus] = useState<ReviewStatus>("PENDING");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<ReviewType>("DESIGN");
  const [editStatus, setEditStatus] = useState<ReviewStatus>("PENDING");
  const [editImageUrl, setEditImageUrl] = useState("");

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch(addUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, status, imageUrl }),
    });
    setName("");
    setType("DESIGN");
    setStatus("PENDING");
    setImageUrl("");
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setEditName(p.name);
    setEditType(p.type);
    setEditStatus(p.status);
    setEditImageUrl(p.imageUrl ?? "");
  }

  async function saveEdit(id: string) {
    setLoading(true);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, type: editType, status: editStatus, imageUrl: editImageUrl }),
    });
    setEditId(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteProduct(id: string, productName: string) {
    if (!confirm(`「${productName}」を削除しますか？`)) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">商品一覧</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "キャンセル" : "+ 商品を追加"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProduct} className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">商品名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="商品名を入力"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">監修区分</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ReviewType)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(REVIEW_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">ステータス</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReviewStatus)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(REVIEW_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              追加
            </button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">商品がまだありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) =>
            editId === p.id ? (
              <div key={p.id} className="bg-white rounded-xl border border-blue-300 p-4">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value as ReviewType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(REVIEW_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ReviewStatus)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(REVIEW_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <ImageUpload value={editImageUrl} onChange={setEditImageUrl} />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => saveEdit(p.id)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {p.imageUrl ? (
                  <div className="relative h-36 bg-gray-50">
                    <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-2" />
                  </div>
                ) : (
                  <div className="h-36 bg-gray-50 flex items-center justify-center text-3xl text-gray-300">📦</div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 mb-2 truncate">{p.name}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <StatusBadge kind="type" value={p.type} />
                    <StatusBadge kind="status" value={p.status} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="flex-1 text-xs text-blue-600 hover:underline"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id, p.name)}
                      className="flex-1 text-xs text-red-400 hover:text-red-600"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
