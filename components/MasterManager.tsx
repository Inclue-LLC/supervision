"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Character = { id: string; name: string; requiresAuthorReview: boolean };
type Licensee = { id: string; name: string };

type Props = {
  characters: Character[];
  licensees: Licensee[];
};

function CharacterRow({ char, onDelete }: { char: Character; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(char.name);
  const [requires, setRequires] = useState(char.requiresAuthorReview);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/characters/${char.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, requiresAuthorReview: requires }),
    });
    setSaving(false);
    setEditing(false);
  }

  async function del() {
    if (!confirm(`「${char.name}」を削除しますか？関連する商品も全て削除されます。`)) return;
    await fetch(`/api/characters/${char.id}`, { method: "DELETE" });
    onDelete(char.id);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
          <input type="checkbox" checked={requires} onChange={(e) => setRequires(e.target.checked)} />
          作家監修あり
        </label>
        <button onClick={save} disabled={saving} className="text-sm text-blue-600 hover:underline">
          {saving ? "保存中" : "保存"}
        </button>
        <button onClick={() => setEditing(false)} className="text-sm text-gray-400">キャンセル</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex-1 text-sm text-gray-900">{char.name}</span>
      {char.requiresAuthorReview && (
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">作家監修あり</span>
      )}
      <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-600">編集</button>
      <button onClick={del} className="text-xs text-red-400 hover:text-red-600">削除</button>
    </div>
  );
}

function LicenseeRow({ licensee, onDelete }: { licensee: Licensee; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(licensee.name);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/licensees/${licensee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    setEditing(false);
  }

  async function del() {
    if (!confirm(`「${licensee.name}」を削除しますか？`)) return;
    await fetch(`/api/licensees/${licensee.id}`, { method: "DELETE" });
    onDelete(licensee.id);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-3 py-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={save} disabled={saving} className="text-sm text-blue-600 hover:underline">
          {saving ? "保存中" : "保存"}
        </button>
        <button onClick={() => setEditing(false)} className="text-sm text-gray-400">キャンセル</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="flex-1 text-sm text-gray-900">{licensee.name}</span>
      <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-600">編集</button>
      <button onClick={del} className="text-xs text-red-400 hover:text-red-600">削除</button>
    </div>
  );
}

export default function MasterManager({ characters: initChars, licensees: initLicensees }: Props) {
  const router = useRouter();
  const [chars, setChars] = useState(initChars);
  const [licensees, setLicensees] = useState(initLicensees);
  const [newCharName, setNewCharName] = useState("");
  const [newCharRequires, setNewCharRequires] = useState(false);
  const [addingChar, setAddingChar] = useState(false);
  const [newLicenseeName, setNewLicenseeName] = useState("");
  const [addingLicensee, setAddingLicensee] = useState(false);

  async function addChar() {
    if (!newCharName.trim()) return;
    const res = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCharName.trim(), requiresAuthorReview: newCharRequires }),
    });
    if (res.ok) {
      const c = await res.json();
      setChars((prev) => [...prev, c]);
      setNewCharName("");
      setNewCharRequires(false);
      setAddingChar(false);
    }
  }

  async function addLicensee() {
    if (!newLicenseeName.trim()) return;
    const res = await fetch("/api/licensees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newLicenseeName.trim() }),
    });
    if (res.ok) {
      const l = await res.json();
      setLicensees((prev) => [...prev, l]);
      setNewLicenseeName("");
      setAddingLicensee(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Characters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">キャラクター</h2>
          <button
            onClick={() => setAddingChar(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            + 追加
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {chars.map((c) => (
            <CharacterRow
              key={c.id}
              char={c}
              onDelete={(id) => setChars((prev) => prev.filter((x) => x.id !== id))}
            />
          ))}
        </div>

        {addingChar && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <input
              autoFocus
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChar()}
              placeholder="キャラクター名"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={newCharRequires}
                onChange={(e) => setNewCharRequires(e.target.checked)}
              />
              作家監修あり（作家IPの場合）
            </label>
            <div className="flex gap-2">
              <button
                onClick={addChar}
                className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700"
              >
                追加
              </button>
              <button
                onClick={() => { setAddingChar(false); setNewCharName(""); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Licensees */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">ライセンシー</h2>
          <button
            onClick={() => setAddingLicensee(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            + 追加
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {licensees.map((l) => (
            <LicenseeRow
              key={l.id}
              licensee={l}
              onDelete={(id) => setLicensees((prev) => prev.filter((x) => x.id !== id))}
            />
          ))}
        </div>

        {addingLicensee && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
            <input
              autoFocus
              value={newLicenseeName}
              onChange={(e) => setNewLicenseeName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLicensee()}
              placeholder="ライセンシー名"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={addLicensee}
                className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700"
              >
                追加
              </button>
              <button
                onClick={() => { setAddingLicensee(false); setNewLicenseeName(""); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
