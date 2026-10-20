"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Licensee = {
  id: string;
  name: string;
  _count: { products: number };
};

type Region = {
  id: string;
  name: string;
  licensees: Licensee[];
};

type Props = {
  characterId: string;
  region: Region;
};

export default function RegionDetail({ characterId, region }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function addLicensee(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${characterId}/regions/${region.id}/licensees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function updateLicensee(id: string) {
    if (!editName.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${characterId}/regions/${region.id}/licensees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditId(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteLicensee(id: string, licenseeName: string) {
    if (!confirm(`「${licenseeName}」を削除しますか？商品もすべて削除されます。`)) return;
    await fetch(`/api/characters/${characterId}/regions/${region.id}/licensees/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-gray-900">ライセンシー一覧</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "キャンセル" : "+ ライセンシーを追加"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addLicensee} className="flex gap-3 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ライセンシー名（会社名）"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            追加
          </button>
        </form>
      )}

      {region.licensees.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">ライセンシーがまだいません</p>
      ) : (
        <div className="space-y-3">
          {region.licensees.map((l) => (
            <div key={l.id} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex-1">
                {editId === l.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => updateLicensee(l.id)}
                      disabled={loading}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{l.name}</p>
                    <p className="text-xs text-gray-500">{l._count.products}商品</p>
                  </div>
                )}
              </div>
              {editId !== l.id && (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/characters/${characterId}/regions/${region.id}/licensees/${l.id}`}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    詳細 →
                  </Link>
                  <button
                    onClick={() => { setEditId(l.id); setEditName(l.name); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteLicensee(l.id, l.name)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
