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

type SampleStatus = "IN_REVIEW" | "APPROVED" | null;

const SATO_BADGE: Record<string, { label: string; cls: string }> = {
  REVISION_NEEDED: { label: "差し戻し", cls: "bg-orange-100 text-orange-700" },
  APPROVED:        { label: "校了",     cls: "bg-green-100 text-green-700" },
  IN_REVIEW:       { label: "確認中",   cls: "bg-blue-100 text-blue-700" },
};

export default function StageSection({ productId, stageType, stage, defaultOpen }: Props) {
  const [open] = useState(true);
  const [satoStatus, setSatoStatus] = useState<SatoStatus>(
    (stage?.satoStatus as SatoStatus) ?? "PENDING"
  );
  const [satoNote, setSatoNote] = useState(stage?.satoNote ?? "");
  const [authorNote, setAuthorNote] = useState(stage?.authorNote ?? "");
  const [fileUrls, setFileUrls] = useState<string[]>(parseFileUrls(stage?.fileUrl ?? null));
  const isSample = stageType.startsWith("SAMPLE_");
  const [sampleStatus, setSampleStatus] = useState<SampleStatus>(
    isSample
      ? (stage?.authorStatus === "APPROVED" ? "APPROVED" : stage?.authorStatus === "IN_REVIEW" ? "IN_REVIEW" : null)
      : null
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
    if (isSample) {
      payload.authorStatus = sampleStatus ?? "NOT_REQUIRED";
    }
    await fetch(`/api/products/${productId}/stages/${stageType}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const hasData = stage !== null;
  const satoBadge = SATO_BADGE[satoStatus];
  const sampleStatusLabel =
    sampleStatus === "IN_REVIEW" ? "作家監修中" : sampleStatus === "APPROVED" ? "作家監修完了" : null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 flex-wrap px-5 py-4 bg-white border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{STAGE_TYPE_LABELS[stageType]}</span>
        {hasData && satoBadge && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${satoBadge.cls}`}>
            {satoBadge.label}
          </span>
        )}
        {sampleStatusLabel && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              sampleStatus === "APPROVED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            }`}
          >
            {sampleStatusLabel}
          </span>
        )}
        {!hasData && <span className="text-xs text-gray-400">未開始</span>}
      </div>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-white">
          {/* Sample overall status */}
          {isSample && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">全体ステータス</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSampleStatus("IN_REVIEW")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    sampleStatus === "IN_REVIEW"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  作家監修中
                </button>
                <button
                  type="button"
                  onClick={() => setSampleStatus("APPROVED")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    sampleStatus === "APPROVED"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  作家監修完了
                </button>
                {sampleStatus && (
                  <button
                    type="button"
                    onClick={() => setSampleStatus(null)}
                    className="text-xs text-gray-400 hover:text-gray-600 ml-1"
                  >
                    クリア
                  </button>
                )}
              </div>
            </div>
          )}

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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>
          </div>

          {/* Save buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => save("IN_REVIEW")}
              disabled={saving}
              className="bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              保存
            </button>
            <button
              type="button"
              onClick={() => save("REVISION_NEEDED")}
              disabled={saving}
              className="bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              差し戻しで保存
            </button>
            <button
              type="button"
              onClick={() => save("APPROVED")}
              disabled={saving}
              className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              校了で保存
            </button>
            {saved && <span className="text-sm text-green-600">保存しました</span>}
          </div>
        </div>
      )}
    </div>
  );
}
