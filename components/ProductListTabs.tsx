"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import ProductForm from "./ProductForm";
import { StageType, SatoStatus, AuthorStatus, STAGE_TYPE_LABELS, STAGE_TYPES } from "@/lib/types";

type Stage = { stageType: StageType; satoStatus: SatoStatus; authorStatus: AuthorStatus };
type Character = { id: string; name: string; requiresAuthorReview: boolean };
type Licensee = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  character: Character;
  licensee: Licensee | null;
  isCompleted: boolean;
  stages: Stage[];
  updatedAt: string;
};

type Props = {
  inProgress: Product[];
  completed: Product[];
  characters: Character[];
  licensees: Licensee[];
};

function StageProgress({ stages, requiresAuthorReview }: { stages: Stage[]; requiresAuthorReview: boolean }) {
  return (
    <div className="flex gap-1">
      {STAGE_TYPES.map((st) => {
        const stage = stages.find((s) => s.stageType === st);
        const done = stage?.satoStatus === "APPROVED" && (!requiresAuthorReview || stage?.authorStatus === "APPROVED");
        const active = stage && stage.satoStatus !== "PENDING";
        return (
          <div
            key={st}
            title={STAGE_TYPE_LABELS[st]}
            className={`w-2 h-2 rounded-full ${
              done ? "bg-green-500" : active ? "bg-blue-400" : "bg-gray-200"
            }`}
          />
        );
      })}
    </div>
  );
}

function ProductTable({ products, emptyText }: { products: Product[]; emptyText: string }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-16">{emptyText}</p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-y border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">キャラクター</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ライセンシー</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">段階</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {p.character.name}
                {p.character.requiresAuthorReview && (
                  <span className="ml-1 text-xs text-purple-600 bg-purple-50 px-1 py-0.5 rounded">作家監修</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{p.licensee?.name ?? "自社製造"}</td>
              <td className="px-6 py-4">
                <StageProgress stages={p.stages} requiresAuthorReview={p.character.requiresAuthorReview} />
              </td>
              <td className="px-6 py-4 text-xs text-gray-400">
                {new Date(p.updatedAt).toLocaleDateString("ja-JP")}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/products/${p.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  詳細 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductListTabs({ inProgress, completed, characters, licensees }: Props) {
  const [tab, setTab] = useState<"progress" | "completed">("progress");
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-0.5 border-b border-gray-200">
          {(["progress", "completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t === "progress" ? (
                <>進行中の商品 <span className="ml-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{inProgress.length}</span></>
              ) : (
                <>サンプル校了済み <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{completed.length}</span></>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + 商品追加
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {tab === "progress" ? (
          <ProductTable products={inProgress} emptyText="進行中の商品はありません" />
        ) : (
          <ProductTable products={completed} emptyText="校了済みの商品はありません" />
        )}
      </div>

      {showForm && (
        <ProductForm
          characters={characters}
          licensees={licensees}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
