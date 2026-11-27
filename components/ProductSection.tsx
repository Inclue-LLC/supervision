"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import ImageUpload from "./ImageUpload";
import {
  ReviewType,
  ReviewStatus,
  AuthorReviewStatus,
  REVIEW_STATUS_LABELS,
  REVIEW_TYPE_LABELS,
  AUTHOR_REVIEW_STATUS_LABELS,
} from "@/lib/types";

type Product = {
  id: string;
  name: string;
  type: ReviewType;
  status: ReviewStatus;
  satoNote: string | null;
  authorStatus: AuthorReviewStatus;
  authorNote: string | null;
  imageUrl: string | null;
  createdAt: string;
};

type Props = {
  products: Product[];
  addUrl: string;
  requiresAuthorReview: boolean;
};

export default function ProductSection({ products, addUrl, requiresAuthorReview }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<ReviewType>("DESIGN");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product & { imageUrl: string }>>({});

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch(addUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, imageUrl }),
    });
    setName("");
    setType("DESIGN");
    setImageUrl("");
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setEditData({
      name: p.name,
      type: p.type,
      status: p.status,
      satoNote: p.satoNote ?? "",
      authorStatus: p.authorStatus,
      authorNote: p.authorNote ?? "",
      imageUrl: p.imageUrl ?? "",
    });
  }

  async function saveEdit(id: string) {
    setLoading(true);
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditId(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
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
        <div className="space-y-3">
          {products.map((p) =>
            editId === p.id ? (
              <div key={p.id} className="bg-white rounded-xl border border-blue-300 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">商品名</label>
                    <input
                      type="text"
                      value={editData.name ?? ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">監修区分</label>
                    <select
                      value={editData.type}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value as ReviewType })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(REVIEW_TYPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                    <ImageUpload value={editData.imageUrl ?? ""} onChange={(url) => setEditData({ ...editData, imageUrl: url })} />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-blue-800 mb-2">佐藤の監修</p>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">ステータス</label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value as ReviewStatus })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(REVIEW_STATUS_LABELS).filter(([k]) => k !== "COMPLETED").map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">修正メモ・確認内容</label>
                      <textarea
                        value={editData.satoNote ?? ""}
                        onChange={(e) => setEditData({ ...editData, satoNote: e.target.value })}
                        placeholder="修正箇所や確認内容を記録..."
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {requiresAuthorReview && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <p className="text-xs font-semibold text-purple-800 mb-2">作家の監修</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ステータス</label>
                        <select
                          value={editData.authorStatus}
                          onChange={(e) => setEditData({ ...editData, authorStatus: e.target.value as AuthorReviewStatus })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          {Object.entries(AUTHOR_REVIEW_STATUS_LABELS).filter(([k]) => k !== "NOT_REQUIRED").map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">作家からの修正依頼・確認内容</label>
                        <textarea
                          value={editData.authorNote ?? ""}
                          onChange={(e) => setEditData({ ...editData, authorNote: e.target.value })}
                          placeholder="作家からの修正依頼内容を記録..."
                          rows={3}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(p.id)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex gap-4 p-4">
                  {p.imageUrl ? (
                    <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} fill className="object-contain p-1" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center text-2xl text-gray-300">📦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEdit(p)} className="text-xs text-blue-600 hover:underline">編集</button>
                        <button onClick={() => deleteProduct(p.id, p.name)} className="text-xs text-red-400 hover:text-red-600">削除</button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <StatusBadge kind="type" value={p.type} />
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16 shrink-0">佐藤監修</span>
                        <StatusBadge kind="status" value={p.status} />
                        {p.satoNote && (
                          <span className="text-xs text-gray-600 truncate">{p.satoNote}</span>
                        )}
                      </div>
                      {requiresAuthorReview && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16 shrink-0">作家監修</span>
                          <StatusBadge kind="authorStatus" value={p.authorStatus} />
                          {p.authorNote && (
                            <span className="text-xs text-gray-600 truncate">{p.authorNote}</span>
                          )}
                        </div>
                      )}
                    </div>
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
