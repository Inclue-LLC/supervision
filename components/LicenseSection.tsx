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
  _count: { licensees: number };
  licensees: Licensee[];
};

type Props = {
  characterId: string;
  regions: Region[];
};

export default function LicenseSection({ characterId, regions }: Props) {
  const router = useRouter();
  const [showRegionForm, setShowRegionForm] = useState(false);
  const [regionName, setRegionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editRegionId, setEditRegionId] = useState<string | null>(null);
  const [editRegionName, setEditRegionName] = useState("");

  async function addRegion(e: React.FormEvent) {
    e.preventDefault();
    if (!regionName.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${characterId}/regions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regionName }),
    });
    setRegionName("");
    setShowRegionForm(false);
    setLoading(false);
    router.refresh();
  }

  async function updateRegion(id: string) {
    if (!editRegionName.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${characterId}/regions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editRegionName }),
    });
    setEditRegionId(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteRegion(id: string, name: string) {
    if (!confirm(`「${name}」地域を削除しますか？ライセンシーと商品もすべて削除されます。`)) return;
    await fetch(`/api/characters/${characterId}/regions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">地域一覧</h3>
        <button
          onClick={() => setShowRegionForm(!showRegionForm)}
          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
        >
          {showRegionForm ? "キャンセル" : "+ 地域を追加"}
        </button>
      </div>

      {showRegionForm && (
        <form onSubmit={addRegion} className="flex gap-2 mb-4">
          <input
            type="text"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            placeholder="地域名（例：日本）"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
          >
            追加
          </button>
        </form>
      )}

      {regions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">地域がまだありません</p>
      ) : (
        <div className="space-y-3">
          {regions.map((r) => (
            <div key={r.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                {editRegionId === r.id ? (
                  <div className="flex gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editRegionName}
                      onChange={(e) => setEditRegionName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <button
                      onClick={() => updateRegion(r.id)}
                      disabled={loading}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditRegionId(null)}
                      className="border border-gray-300 px-2 py-1 rounded text-xs text-gray-600 hover:bg-gray-50"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <h4 className="text-sm font-semibold text-gray-900">{r.name}</h4>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500">{r._count.licensees}社</span>
                  {editRegionId !== r.id && (
                    <>
                      <button
                        onClick={() => { setEditRegionId(r.id); setEditRegionName(r.name); }}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteRegion(r.id, r.name)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        削除
                      </button>
                    </>
                  )}
                </div>
              </div>

              {r.licensees.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {r.licensees.map((l) => (
                    <Link
                      key={l.id}
                      href={`/characters/${characterId}/regions/${r.id}/licensees/${l.id}`}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-2.5 py-1 rounded-lg text-xs transition-colors"
                    >
                      {l.name}
                      <span className="text-gray-400">({l._count.products})</span>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/characters/${characterId}/regions/${r.id}`}
                className="text-xs text-green-600 hover:underline"
              >
                地域詳細を見る →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
