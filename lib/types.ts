export type StageType =
  | "DESIGN_1" | "DESIGN_2" | "DESIGN_3" | "DESIGN_4" | "DESIGN_5"
  | "SAMPLE_1" | "SAMPLE_2" | "SAMPLE_3" | "SAMPLE_4" | "SAMPLE_5";
export type SatoStatus = "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED";
export type AuthorStatus = "NOT_REQUIRED" | "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED";

export const STAGE_TYPE_LABELS: Record<StageType, string> = {
  DESIGN_1: "デザイン1",
  DESIGN_2: "デザイン2",
  DESIGN_3: "デザイン3",
  DESIGN_4: "デザイン4",
  DESIGN_5: "デザイン5",
  SAMPLE_1: "サンプル1",
  SAMPLE_2: "サンプル2",
  SAMPLE_3: "サンプル3",
  SAMPLE_4: "サンプル4",
  SAMPLE_5: "サンプル5",
};

export const STAGE_TYPES: StageType[] = [
  "DESIGN_1", "DESIGN_2", "DESIGN_3", "DESIGN_4", "DESIGN_5",
  "SAMPLE_1", "SAMPLE_2", "SAMPLE_3", "SAMPLE_4", "SAMPLE_5",
];

export const SATO_STATUS_LABELS: Record<SatoStatus, string> = {
  PENDING: "受付待ち",
  IN_REVIEW: "確認中",
  REVISION_NEEDED: "差し戻し",
  APPROVED: "佐藤OK",
};

export const SATO_STATUS_COLORS: Record<SatoStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  REVISION_NEEDED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
};

export const AUTHOR_STATUS_LABELS: Record<AuthorStatus, string> = {
  NOT_REQUIRED: "対象外",
  PENDING: "送付待ち",
  IN_REVIEW: "確認中",
  REVISION_NEEDED: "差し戻し",
  APPROVED: "作家OK",
};

export const AUTHOR_STATUS_COLORS: Record<AuthorStatus, string> = {
  NOT_REQUIRED: "bg-gray-100 text-gray-400",
  PENDING: "bg-yellow-50 text-yellow-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  REVISION_NEEDED: "bg-red-100 text-red-700",
  APPROVED: "bg-green-100 text-green-700",
};
