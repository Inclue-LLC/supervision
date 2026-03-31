"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { ReviewStatus } from "@/lib/types";

type Product = { status: string };
type Licensee = {
  id: string;
  name: string;
  products: Product[];
  _count: { products: number };
};
type Character = {
  id: string;
  name: string;
  licensees: Licensee[];
};

export default function CharacterDetail({ character }: { character: Character }) {
  const router = useRouter();
  const [newLicenseeName, setNewLicenseeName] = useState("");
  const [loading, setLoading] = useState(false);

  async function addLicensee(e: React.FormEvent) {
    e.preventDefault();
    if (!newLicenseeName.trim()) return;
    setLoading(true);
    await fetch(`/api/characters/${character.id}/licensees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newLicenseeName }),
    });
    setNewLicenseeName("");
    setLoading(false);
    router.refresh();
  }

  async function deleteCharacter() {
    if (!confirm(`「${character.name}」を削除しますか？`)) return;
    await fetch(`/api/characters/${character.id}`, { method: "DELETE" });
    router.push("/characters");
    router.refresh();
  }

  async function deleteLicensee(licenseeId: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return;
    await fetch(`/api/characters/${character.id}/licensees/${licenseeId}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/characters" className="hover:text-gray-900">キャラクター</Link>
        <span>/</span>
        <span className="text-gray-900">{character.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{character.name}</h2>
        <button
          onClick={deleteCharacter}
          className="text-red-500 text-sm border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-3">ライセンシー</h3>
          {character.licensees.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
              ライセンシーがまだ登録されていません
            </div>
          ) : (
            <div className="space-y-2">
              {character.licensees.map((l) => {
                const pending = l.products.filter((p) => p.status === "PENDING").length;
                const inReview = l.products.filter((p) => p.status === "IN_REVIEW").length;
                return (
                  <div
                    key={l.id}
                    className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/characters/${character.id}/licensees/${l.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {l.name}
                      </Link>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-gray-400">商品 {l._count.products}件</span>
                        {pending > 0 && (
                          <StatusBadge kind="status" value={"PENDING" as ReviewStatus} />
                        )}
                        {inReview > 0 && (
                          <StatusBadge kind="status" value={"IN_REVIEW" as ReviewStatus} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/characters/${character.id}/licensees/${l.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        詳細
                      </Link>
                      <button
                        onClick={() => deleteLicensee(l.id, l.name)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">ライセンシーを追加</h3>
          <form onSubmit={addLicensee} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="会社名"
              value={newLicenseeName}
              onChange={(e) => setNewLicenseeName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              追加
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
