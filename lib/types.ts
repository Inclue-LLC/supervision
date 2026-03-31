export type ReviewType = "DESIGN" | "SAMPLE";
export type ReviewStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "REVISION_NEEDED"
  | "APPROVED"
  | "COMPLETED";

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  DESIGN: "デザイン",
  SAMPLE: "サンプル",
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "依頼中",
  IN_REVIEW: "監修中",
  REVISION_NEEDED: "差し戻し",
  APPROVED: "承認済み",
  COMPLETED: "完了",
};

export const REVIEW_STATUS_COLORS: Record<ReviewStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  REVISION_NEEDED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export const REVIEW_TYPE_COLORS: Record<ReviewType, string> = {
  DESIGN: "bg-purple-100 text-purple-800",
  SAMPLE: "bg-orange-100 text-orange-800",
};
