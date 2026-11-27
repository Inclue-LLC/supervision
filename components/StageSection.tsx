"use client";

import { useState } from "react";
import ImageUpload from "./ImageUpload";
import StatusBadge from "./StatusBadge";
import {
  StageType,
  SatoStatus,
  AuthorStatus,
  STAGE_TYPE_LABELS,
  SATO_STATUS_LABELS,
  AUTHOR_STATUS_LABELS,
} from "@/lib/types";

type Stage = {
  stageType: StageType;
  satoStatus: SatoStatus;
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
};

const SATO_STATUS_OPTIONS: SatoStatus[] = ["PENDING", "IN_REVIEW", "REVISION_NEEDED", "APPROVED"];
const AUTHOR_STATUS_OPTIONS: AuthorStatus[] = ["NOT_REQUIRED", "PENDING", "IN_REVIEW", "REVISION_NEEDED", "APPROVED"];

export default function StageSection({ productId, stageType, stage, requiresAuthorReview }: Props) {
  const [open, setOpen] = useState(false);
  const [satoStatus, setSatoStatus] = useState<SatoStatus>(stage?.satoStatus ?? "PENDING");
  const [satoNote, setSatoNote] = useState(stage?.satoNote ?? "");
  const [authorStatus, setAuthorStatus] = useState<AuthorStatus>(
    stage?.authorStatus ?? (requiresAuthorReview ? "PENDING" : "NOT_REQUIRED")
  );
  const [authorNote, setAuthorNote] = useState(stage?.authorNote ?? "");
  const [fileUrl, setFileUrl] = useState(stage?.fileUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/products/${productId}/stages/${stageType}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ satoStatus, satoNote, authorStatus, authorNote, fileUrl: fileUrl || null }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const hasData = stage !== null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-900">{STAGE_TYPE_LABELS[stageType]}</span>
          {hasData && (
            <div className="flex gap-1.5">
              <StatusBadge kind="sato" value={satoStatus} />
              {requiresAuthorReview && authorStatus !== "NOT_REQUIRED" && (
                <StatusBadge kind="author" value={authorStatus} />
              )}
            </div>
          )}
          {!hasData && (
            <span className="text-xs text-gray-400">未開始</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-white">
          {/* PDF */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">PDF</p>
            <ImageUpload value={fileUrl} onChange={setFileUrl} />
          </div>

          {/* Sato review */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">佐藤監修</p>
            <div className="flex gap-3 items-start flex-wrap">
              <div>
                <label className="block text-xs text-gray-500 mb-1">ステータス</label>
                <select
                  value={satoStatus}
                  onChange={(e) => setSatoStatus(e.target.value as SatoStatus)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SATO_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{SATO_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
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

          {/* Author review */}
          {requiresAuthorReview && (
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">作家監修</p>
              <div className="flex gap-3 items-start flex-wrap">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">ステータス</label>
                  <select
                    value={authorStatus}
                    onChange={(e) => setAuthorStatus(e.target.value as AuthorStatus)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {AUTHOR_STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{AUTHOR_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
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
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            {saved && <span className="text-sm text-green-600">保存しました</span>}
          </div>
        </div>
      )}
    </div>
  );
}
