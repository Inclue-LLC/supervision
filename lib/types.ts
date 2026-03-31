export type ProjectStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "REVISION_NEEDED"
  | "APPROVED"
  | "COMPLETED";

export type ContentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "REVISION_NEEDED"
  | "APPROVED";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  PENDING: "依頼中",
  IN_REVIEW: "監修中",
  REVISION_NEEDED: "差し戻し",
  APPROVED: "承認済み",
  COMPLETED: "完了",
};

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "下書き",
  SUBMITTED: "提出済み",
  IN_REVIEW: "監修中",
  REVISION_NEEDED: "要修正",
  APPROVED: "承認済み",
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  REVISION_NEEDED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-yellow-100 text-yellow-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  REVISION_NEEDED: "bg-red-100 text-red-800",
  APPROVED: "bg-green-100 text-green-800",
};
