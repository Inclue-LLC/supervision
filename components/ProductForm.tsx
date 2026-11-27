"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Character = { id: string; name: string; requiresAuthorReview: boolean };
type Licensee = { id: string; name: string };

type Props = {
  characters: Character[];
  licensees: Licensee[];
  onClose: () => void;
};

export default function ProductForm({ characters, licensees, onClose }: Props) {
  const router = useRouter();
  const [characterId, setCharacterId] = useState(characters[0]?.id ?? "");
  const [licenseeId, setLicenseeId] = useState("");
  const [theme, setTheme] = useState("");
  const [names, setNames] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addName() {
    setNames((prev) => [...prev, ""]);
  }

  function removeName(i: number) {
    setNames((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateName(i: number, value: string) {
    setNames((prev) => prev.map((n, idx) => idx === i ? value : n));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validNames = names.map((n) => n.trim()).filter(Boolean);
    if (validNames.length === 0 || !characterId) {
      setError("商品名とキャラクターは必須です");
      return;
    }
    setSaving(true);
    setError("");
    let lastProduct = null;
    for (const name of validNames) {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme: theme.trim() || null, characterId, licenseeId: licenseeId || null }),
      });
      if (res.ok) {
        lastProduct = await res.json();
      } else {
        const data = await res.json();
        setError(data.error ?? "エラーが発生しました");
        setSaving(false);
        return;
      }
    }
    if (validNames.length === 1 && lastProduct) {
      router.push(`/products/${lastProduct.id}`);
    }
    router.refresh();
    onClose();
    setSaving(false);
  }

  const validCount = names.filter((n) => n.trim()).length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">商品追加</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Character */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              キャラクター <span className="text-red-500">*</span>
            </label>
            {characters.length === 0 ? (
              <p className="text-sm text-gray-400">マスタ管理からキャラクターを登録してください</p>
            ) : (
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {characters.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Licensee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ライセンシー
              <span className="ml-1 text-xs text-gray-400">（なければ自社製造）</span>
            </label>
            <select
              value={licenseeId}
              onChange={(e) => setLicenseeId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">自社製造</option>
              {licensees.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">テーマ</label>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="テーマを入力（任意）"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product names */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              商品名 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {names.map((n, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={n}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder="商品名を入力"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {names.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeName(i)}
                      className="text-gray-400 hover:text-red-500 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addName} className="mt-2 text-sm text-blue-600 hover:underline">
              + 商品名を追加
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving || characters.length === 0}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "追加中..." : validCount > 1 ? `${validCount}件を追加` : "商品を追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
