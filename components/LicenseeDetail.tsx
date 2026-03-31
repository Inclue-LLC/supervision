"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import ImageUpload from "./ImageUpload";
import {
  ReviewStatus,
  ReviewType,
  REVIEW_STATUS_LABELS,
  REVIEW_TYPE_LABELS,
} from "@/lib/types";

type Supervisor = { id: string; name: string };
type Comment = {
  id: string;
  body: string;
  createdAt: string;
  supervisor: Supervisor | null;
};
type Product = {
  id: string;
  name: string;
  type: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
  _count: { comments: number };
  comments: Comment[];
};
type Licensee = {
  id: string;
  name: string;
  character: { id: string; name: string };
  products: Product[];
};

type Props = {
  licensee: Licensee;
  supervisors: Supervisor[];
  characterId: string;
};

export default function LicenseeDetail({ licensee, supervisors, characterId }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", type: "DESIGN", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [commentSupervisorId, setCommentSupervisorId] = useState("");

  const baseUrl = `/api/characters/${characterId}/licensees/${licensee.id}`;

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!newProduct.name.trim()) return;
    setLoading(true);
    await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    setNewProduct({ name: "", type: "DESIGN", imageUrl: "" });
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function updateStatus(productId: string, status: ReviewStatus) {
    await fetch(`${baseUrl}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function deleteProduct(productId: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await fetch(`${baseUrl}/products/${productId}`, { method: "DELETE" });
    router.refresh();
  }

  async function addComment(productId: string) {
    if (!commentBody.trim()) return;
    setLoading(true);
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: commentBody,
        productId,
        supervisorId: commentSupervisorId || null,
      }),
    });
    setCommentBody("");
    setLoading(false);
    router.refresh();
  }

  async function deleteComment(commentId: string) {
    await fetch(`/api/comments?id=${commentId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/characters" className="hover:text-gray-900">キャラクター</Link>
        <span>/</span>
        <Link href={`/characters/${characterId}`} className="hover:text-gray-900">
          {licensee.character.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{licensee.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{licensee.name}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 商品を追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">商品を追加</h3>
          <form onSubmit={addProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  監修区分 <span className="text-red-500">*</span>
                </label>
                <select
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DESIGN">デザイン</option>
                  <option value="SAMPLE">サンプル</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
              <ImageUpload
                value={newProduct.imageUrl}
                onChange={(url) => setNewProduct({ ...newProduct, imageUrl: url })}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                登録する
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {licensee.products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 text-sm">
          商品がまだ登録されていません
        </div>
      ) : (
        <div className="space-y-4">
          {licensee.products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{p.name}</span>
                      <StatusBadge kind="type" value={p.type as ReviewType} />
                      <StatusBadge kind="status" value={p.status as ReviewStatus} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString("ja-JP")} · コメント {p._count.comments}件
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value as ReviewStatus)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    {(Object.keys(REVIEW_STATUS_LABELS) as ReviewStatus[]).map((s) => (
                      <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === p.id ? null : p.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {expandedProduct === p.id ? "閉じる" : "コメント"}
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id, p.name)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>

              {expandedProduct === p.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <div className="mb-3 space-y-2">
                    <div className="flex gap-2">
                      <select
                        value={commentSupervisorId}
                        onChange={(e) => setCommentSupervisorId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                      >
                        <option value="">監修者（任意）</option>
                        {supervisors.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="コメントを入力..."
                        value={commentBody}
                        onChange={(e) => setCommentBody(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addComment(p.id)}
                        disabled={loading || !commentBody.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                  {p.comments.length === 0 ? (
                    <p className="text-xs text-gray-400">コメントはありません</p>
                  ) : (
                    <div className="space-y-2">
                      {p.comments.map((c) => (
                        <div key={c.id} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">
                              {c.supervisor?.name ?? "匿名"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                              </span>
                              <button
                                onClick={() => deleteComment(c.id)}
                                className="text-xs text-red-400 hover:text-red-600"
                              >
                                削除
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-0.5">{c.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
