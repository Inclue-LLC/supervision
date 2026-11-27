"use client";

import { useState } from "react";
import StageSection from "./StageSection";
import { STAGE_TYPES, STAGE_TYPE_LABELS, StageType } from "@/lib/types";

type Stage = {
  stageType: StageType;
  satoStatus: string;
  satoNote: string | null;
  authorStatus: "NOT_REQUIRED" | "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED";
  authorNote: string | null;
  fileUrl: string | null;
};

type Props = {
  productId: string;
  stages: Stage[];
  requiresAuthorReview: boolean;
};

export default function ProductStages({ productId, stages, requiresAuthorReview }: Props) {
  const existingTypes = stages.map((s) => s.stageType);
  const [visibleTypes, setVisibleTypes] = useState<StageType[]>(
    STAGE_TYPES.filter((t) => existingTypes.includes(t))
  );
  const [adding, setAdding] = useState(false);

  const stageMap = Object.fromEntries(stages.map((s) => [s.stageType, s]));
  const availableToAdd = STAGE_TYPES.filter((t) => !visibleTypes.includes(t));

  function addStageType(type: StageType) {
    setVisibleTypes((prev) => {
      const next = [...prev, type];
      return STAGE_TYPES.filter((t) => next.includes(t));
    });
    setAdding(false);
  }

  return (
    <div className="space-y-3">
      {visibleTypes.map((stageType) => (
        <StageSection
          key={stageType}
          productId={productId}
          stageType={stageType}
          stage={stageMap[stageType] ?? null}
          requiresAuthorReview={requiresAuthorReview}
        />
      ))}

      {availableToAdd.length > 0 && (
        <div>
          {adding ? (
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
              <p className="text-xs text-gray-500 mb-2">追加するステージを選択</p>
              <div className="flex gap-2 flex-wrap">
                {availableToAdd.map((type) => (
                  <button
                    key={type}
                    onClick={() => addStageType(type)}
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {STAGE_TYPE_LABELS[type]}
                  </button>
                ))}
                <button
                  onClick={() => setAdding(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 px-2"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
            >
              + ステージを追加
            </button>
          )}
        </div>
      )}
    </div>
  );
}
