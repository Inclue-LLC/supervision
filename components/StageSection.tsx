"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import { StageType, STAGE_TYPE_LABELS } from "@/lib/types";

type SatoStatus = "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED";
type AuthorStatus = "NOT_REQUIRED" | "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED";

type Stage = {
  stageType: StageType;
  satoStatus: string;
  satoNote: string | null;
  authorStatus: AuthorStatus;
  authorNote: string | null;
  fileUrl: string | null;
};

type Props = {
  productId: string;
  stageType: StageType;
  stage: Stage | null;
  requiresAuthorReview: boolean;
  defaultOpen?: boolean;
  onDelete?: () => void;
};

function parseFileUrls(fileUrl: string | null): string[] {
  if (!fileUrl) return [];
  try {
    const parsed = JSON.parse(fileUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [fileUrl];
}

function serializeFileUrls(urls: string[]): string | null {
  if (urls.length === 0) return null;
  if (urls.length === 1) return urls[0];
  return JSON.stringify(urls);
}

const SATO_BADGE: Record<string, { label: string; cls: string }> = {
  IN_REVIEW:       { label: "作家監修依頼済", cls: "bg-sky-100 text-sky-700" },
  REVISION_NEEDED: { label: "差し戻し",      cls: "bg-amber-100 text-amber-700" },
  APPROVED:        { label: "校了",          cls: "bg-emerald-100 text-emerald-700" },
};

export default function StageSection({ productId, stageType, stage, onDelete }: Props) {
  const [open] = useState(true);
  const [satoStatus, setSatoStatus] = useState<SatoStatus>(
    (stage?.satoStatus as SatoStatus) ?? "PENDING"
  );
  const [satoNote, setSatoNote] = useState(stage?.satoNote ?? "");
  const [authorNote, setAuthorNote] = useState(stage?.authorNote ?? "");
  const [fileUrls, setFileUrls] = useState<string[]>(parseFileUrls(stage?.fileUrl ?? null));
  const isSample = stageType.startsWith("SAMPLE_");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save(newSatoStatus: SatoStatus) {
    setSaving(true);
    setSaved(false);
    setSatoStatus(newSatoStatus);
    const payload: Record<string, unknown> = {
      satoStatus: newSatoStatus,
      satoNote: satoNote || null,
      authorNote: authorNote || null,
      fileUrl: serializeFileUrls(fileUrls),
    };
    await fetch(`/api/products/${productId}/stages/${stageType}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm(`「${STAGE_TYPE_LABELS[stageType]}」を削除しますか？`)) return;
    setDeleting(true);
    await fetch(`/api/products/${productId}/stages/${stageType}`, { method: "DELETE" });
    onDelete?.();
  }

  const hasData = stage !== null;
  const satoBadge = SATO_BADGE[satoStatus];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 flex-wrap px-5 py-4 bg-white border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{STAGE_TYPE_LABELS[stageType]}</span>
        {hasData && satoBadge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${satoBadge.cls}`}>
            {satoBadge.label}
          </span>
        )}
        {!hasData && <span className="text-xs text-gray-400">未開始</span>}
      </div>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-white">
          {/* Images */}
          <ImageUpload values={fileUrls} onChange={setFileUrls} />

          {/* Sato review */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-700">佐藤監修</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">修正内容・メモ</label>
              <textarea
                value={satoNote}
                onChange={(e) => setSatoNote(e.target.value)}
                rows={3}
                placeholder="佐藤が指摘した修正内容をメモ..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            </div>
          </div>

          {/* Author review — always shown */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-purple-700">作家監修</p>
            <div>
              <label className="block text-xs text-gray-500 mb-1">作家からの修正依頼</label>
              <textarea
                value={authorNote}
                onChange={(e) => setAuthorNote(e.target.value)}
                rows={3}
                placeholder="作家から来た修正依頼の内容をメモ..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
            >
              削除
            </button>
            <button
              type="button"
              onClick={() => save("IN_REVIEW")}
              disabled={saving}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 disabled:opacity-50 transition-colors"
            >
              作家に監修依頼済みで保存
            </button>
            <button
              type="button"
              onClick={() => save("REVISION_NEEDED")}
              disabled={saving}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 transition-colors"
            >
              差し戻しで保存
            </button>
            <button
              type="button"
              onClick={() => save("APPROVED")}
              disabled={saving}
              className="text-sm font-medium px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
            >
              校了で保存
            </button>
            {saved && <span className="text-sm text-emerald-600">保存しました</span>}
          </div>
        </div>
      )}
    </div>
  );
}
