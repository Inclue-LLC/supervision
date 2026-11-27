export type ReviewType = "DESIGN" | "SAMPLE";
export type ReviewStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "REVISION_NEEDED"
  | "APPROVED"
  | "COMPLETED";
export type AuthorReviewStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "IN_REVIEW"
  | "REVISION_NEEDED"
  | "APPROVED";

export const REVIEW_TYPE_LABELS: Record<ReviewType, string> = {
  DESIGN: "デザイン",
  SAMPLE: "サンプル",
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  PENDING: "受付待ち",
  IN_REVIEW: "佐藤確認中",
  REVISION_NEEDED: "佐藤差し戻し",
  APPROVED: "佐藤OK",
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

export const AUTHOR_REVIEW_STATUS_LABELS: Record<AuthorReviewStatus, string> = {
  NOT_REQUIRED: "対象外",
  PENDING: "作家送付待ち",
  IN_REVIEW: "作家確認中",
  REVISION_NEEDED: "作家差し戻し",
  APPROVED: "作家OK",
};

export const AUTHOR_REVIEW_STATUS_COLORS: Record<AuthorReviewStatus, string> = {
  NOT_REQUIRED: "bg-gray-100 text-gray-400",
  PENDING: "bg-yellow-50 text-yellow-700",
  IN_REVIEW: "bg-blue-100 text-blue-700",
  REVISION_NEEDED: "bg-red-100 text-red-700",
  APPROVED: "bg-green-100 text-green-700",
};
