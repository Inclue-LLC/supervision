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
  const [name, setName] = useState("");
  const [characterId, setCharacterId] = useState(characters[0]?.id ?? "");
  const [licenseeId, setLicenseeId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // new character/licensee inline creation
  const [newCharName, setNewCharName] = useState("");
  const [addingChar, setAddingChar] = useState(false);
  const [newLicenseeName, setNewLicenseeName] = useState("");
  const [addingLicensee, setAddingLicensee] = useState(false);
  const [charList, setCharList] = useState(characters);
  const [licenseeList, setLicenseeList] = useState(licensees);

  async function createChar() {
    if (!newCharName.trim()) return;
    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCharName.trim(), requiresAuthorReview: false }),
    });
    if (res.ok) {
      const c = await res.json();
      setCharList((prev) => [...prev, c]);
      setCharacterId(c.id);
      setNewCharName("");
      setAddingChar(false);
    }
  }

  async function createLicensee() {
    if (!newLicenseeName.trim()) return;
    const res = await fetch("/api/licensees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newLicenseeName.trim() }),
    });
    if (res.ok) {
      const l = await res.json();
      setLicenseeList((prev) => [...prev, l]);
      setLicenseeId(l.id);
      setNewLicenseeName("");
      setAddingLicensee(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !characterId) {
      setError("商品名とキャラクターは必須です");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), characterId, licenseeId: licenseeId || null }),
    });
    if (res.ok) {
      const product = await res.json();
      router.push(`/products/${product.id}`);
      router.refresh();
      onClose();
    } else {
      const data = await res.json();
      setError(data.error ?? "エラーが発生しました");
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">商品追加</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Character */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              キャラクター <span className="text-red-500">*</span>
            </label>
            {!addingChar ? (
              <div className="flex gap-2">
                <select
                  value={characterId}
                  onChange={(e) => setCharacterId(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {charList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddingChar(true)}
                  className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                >
                  + 新規
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="キャラクター名"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={createChar}
                  className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setAddingChar(false)}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Licensee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              ライセンシー
              <span className="ml-1 text-xs text-gray-400">（なければ自社製造）</span>
            </label>
            {!addingLicensee ? (
              <div className="flex gap-2">
                <select
                  value={licenseeId}
                  onChange={(e) => setLicenseeId(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">自社製造</option>
                  {licenseeList.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAddingLicensee(true)}
                  className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                >
                  + 新規
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newLicenseeName}
                  onChange={(e) => setNewLicenseeName(e.target.value)}
                  placeholder="ライセンシー名"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={createLicensee}
                  className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setAddingLicensee(false)}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Product name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              商品名 <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="商品名を入力"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              disabled={saving}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "追加中..." : "商品を追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
