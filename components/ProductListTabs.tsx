"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";
import { StageType, AuthorStatus, STAGE_TYPE_LABELS, STAGE_TYPES } from "@/lib/types";
// STAGE_TYPES used for ordering in getLatestStage

type Stage = { stageType: StageType; satoStatus: string; authorStatus: AuthorStatus; fileUrl: string | null };
type Character = { id: string; name: string; requiresAuthorReview: boolean };
type Licensee = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  theme: string | null;
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

const SATO_STATUS_LABELS: Record<string, string> = {
  PENDING: "未開始",
  IN_REVIEW: "作家に監修依頼済み",
  REVISION_NEEDED: "差し戻し",
  APPROVED: "校了",
};

const SATO_STATUS_COLORS: Record<string, string> = {
  PENDING: "text-gray-400",
  IN_REVIEW: "text-sky-600",
  REVISION_NEEDED: "text-amber-600",
  APPROVED: "text-emerald-600",
};

function parseFirstImageUrl(fileUrl: string | null): string | null {
  if (!fileUrl) return null;
  try {
    const parsed = JSON.parse(fileUrl);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
  } catch {}
  return fileUrl;
}

function getLatestStage(stages: Stage[]): Stage | null {
  for (let i = STAGE_TYPES.length - 1; i >= 0; i--) {
    const st = STAGE_TYPES[i];
    const stage = stages.find((s) => s.stageType === st);
    if (stage) return stage;
  }
  return null;
}

function CurrentStatus({ stages }: { stages: Stage[] }) {
  const latest = getLatestStage(stages);
  if (!latest) return <span className="text-xs text-gray-300">未開始</span>;
  const statusLabel = SATO_STATUS_LABELS[latest.satoStatus] ?? latest.satoStatus;
  const color = SATO_STATUS_COLORS[latest.satoStatus] ?? "text-gray-500";
  return (
    <span className={`text-xs font-medium ${color}`}>
      {STAGE_TYPE_LABELS[latest.stageType]} - {statusLabel}
    </span>
  );
}

function LatestImage({ stages }: { stages: Stage[] }) {
  const latest = getLatestStage(stages);
  const url = parseFirstImageUrl(latest?.fileUrl ?? null);
  if (!url) return <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs shrink-0">—</div>;
  return (
    <img
      src={url}
      alt="最新画像"
      className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-gray-50 shrink-0"
    />
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
            <th className="px-4 py-3 w-14" />
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">キャラクター</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">テーマ</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ライセンシー</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新日</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/products/${p.id}`}>
              <td className="px-4 py-3">
                <LatestImage stages={p.stages} />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {p.character.name}
                {p.character.requiresAuthorReview && (
                  <span className="ml-1 text-xs text-purple-600 bg-purple-50 px-1 py-0.5 rounded">作家監修</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.theme ?? <span className="text-gray-300">—</span>}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.licensee?.name ?? "自社製造"}</td>
              <td className="px-4 py-3">
                <CurrentStatus stages={p.stages} />
              </td>
              <td className="px-4 py-3 text-xs text-gray-400">
                {new Date(p.updatedAt).toLocaleDateString("ja-JP")}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/products/${p.id}`}
                  className="text-sm text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
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
