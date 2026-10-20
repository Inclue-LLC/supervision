"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Character = {
  id: string;
  name: string;
  _count: { inhouseProducts: number; regions: number };
};

export default function CharacterList({ characters }: { characters: Character[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function addCharacter(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    setShowForm(false);
    setLoading(false);
    router.refresh();
  }

  async function updateCharacter(id: string) {
    if (!editName.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setEditId(null);
    setLoading(false);
    router.refresh();
  }

  async function deleteCharacter(id: string, charName: string) {
    if (!confirm(`「${charName}」を削除しますか？`)) return;
    await fetch(`/api/characters/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? "キャンセル" : "+ キャラクターを追加"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addCharacter} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="キャラクター名"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            追加
          </button>
        </form>
      )}

      {characters.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 text-sm">
          キャラクターがまだ登録されていません
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              {editId === c.id ? (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => updateCharacter(c.id)}
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
                <h3 className="text-base font-semibold text-gray-900 mb-2">{c.name}</h3>
              )}
              <div className="flex gap-3 text-xs text-gray-500 mb-4">
                <span>自社製造: {c._count.inhouseProducts}商品</span>
                <span>地域: {c._count.regions}件</span>
              </div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/characters/${c.id}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  詳細を見る →
                </Link>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditId(c.id); setEditName(c.name); }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => deleteCharacter(c.id, c.name)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
