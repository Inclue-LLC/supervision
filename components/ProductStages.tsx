"use client";

import { useState } from "react";
import StageSection from "./StageSection";
import { STAGE_TYPE_LABELS, StageType } from "@/lib/types";

const DESIGN_QUICK: StageType[] = ["DESIGN_1", "DESIGN_2", "DESIGN_3"];
const DESIGN_EXTRA: StageType[] = ["DESIGN_4", "DESIGN_5"];
const SAMPLE_QUICK: StageType[] = ["SAMPLE_1", "SAMPLE_2", "SAMPLE_3"];
const SAMPLE_EXTRA: StageType[] = ["SAMPLE_4", "SAMPLE_5"];
const ALL_ORDERED: StageType[] = [
  ...DESIGN_QUICK, ...DESIGN_EXTRA,
  ...SAMPLE_QUICK, ...SAMPLE_EXTRA,
];

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
  const existingTypes = new Set(stages.map((s) => s.stageType));

  const [visibleTypes, setVisibleTypes] = useState<Set<StageType>>(
    new Set(existingTypes)
  );
  const [lastAdded, setLastAdded] = useState<StageType | null>(null);

  function addType(type: StageType) {
    setVisibleTypes((prev) => new Set([...prev, type]));
    setLastAdded(type);
  }

  function removeType(type: StageType) {
    setVisibleTypes((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
    setLastAdded(null);
  }

  function handleStageDelete(type: StageType) {
    removeType(type);
  }

  const stageMap = Object.fromEntries(stages.map((s) => [s.stageType, s]));
  const orderedVisible = ALL_ORDERED.filter((t) => visibleTypes.has(t));
  const nextDesignExtra = DESIGN_EXTRA.find((t) => !visibleTypes.has(t));
  const nextSampleExtra = SAMPLE_EXTRA.find((t) => !visibleTypes.has(t));

  function StageButton({ type }: { type: StageType }) {
    const active = visibleTypes.has(type);
    const hasDbData = existingTypes.has(type);

    if (active) {
      return (
        <div className="inline-flex items-center rounded-lg text-sm font-medium border border-blue-600 bg-blue-600 text-white overflow-hidden">
          <span className="px-3 py-1.5">{STAGE_TYPE_LABELS[type]}</span>
          {!hasDbData && (
            <button
              onClick={() => removeType(type)}
              className="px-2 py-1.5 hover:bg-blue-700 transition-colors border-l border-blue-500 leading-none"
              title="削除"
            >
              ×
            </button>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => addType(type)}
        className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        {STAGE_TYPE_LABELS[type]}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stage selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        {/* Design row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">デザイン</span>
          {DESIGN_QUICK.map((type) => (
            <StageButton key={type} type={type} />
          ))}
          {DESIGN_EXTRA.filter((t) => visibleTypes.has(t)).map((type) => (
            <StageButton key={type} type={type} />
          ))}
          {nextDesignExtra && (
            <button
              onClick={() => addType(nextDesignExtra)}
              className="px-3 py-1.5 rounded-lg text-sm border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              + {STAGE_TYPE_LABELS[nextDesignExtra]}
            </button>
          )}
        </div>

        <div className="border-t border-gray-100" />

        {/* Sample row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">サンプル</span>
          {SAMPLE_QUICK.map((type) => (
            <StageButton key={type} type={type} />
          ))}
          {SAMPLE_EXTRA.filter((t) => visibleTypes.has(t)).map((type) => (
            <StageButton key={type} type={type} />
          ))}
          {nextSampleExtra && (
            <button
              onClick={() => addType(nextSampleExtra)}
              className="px-3 py-1.5 rounded-lg text-sm border border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              + {STAGE_TYPE_LABELS[nextSampleExtra]}
            </button>
          )}
        </div>
      </div>

      {/* Stage sections */}
      {orderedVisible.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          上のボタンでステージを選択してください
        </p>
      ) : (
        <div className="space-y-3">
          {orderedVisible.map((stageType) => (
            <StageSection
              key={stageType}
              productId={productId}
              stageType={stageType}
              stage={stageMap[stageType] ?? null}
              requiresAuthorReview={requiresAuthorReview}
              defaultOpen={stageType === lastAdded}
              onDelete={() => handleStageDelete(stageType)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
