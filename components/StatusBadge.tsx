import {
  ReviewStatus,
  ReviewType,
  AuthorReviewStatus,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_COLORS,
  REVIEW_TYPE_LABELS,
  REVIEW_TYPE_COLORS,
  AUTHOR_REVIEW_STATUS_LABELS,
  AUTHOR_REVIEW_STATUS_COLORS,
} from "@/lib/types";

type Props =
  | { kind: "status"; value: ReviewStatus }
  | { kind: "type"; value: ReviewType }
  | { kind: "authorStatus"; value: AuthorReviewStatus };

export default function StatusBadge(props: Props) {
  let label: string;
  let color: string;
  if (props.kind === "status") {
    label = REVIEW_STATUS_LABELS[props.value];
    color = REVIEW_STATUS_COLORS[props.value];
  } else if (props.kind === "type") {
    label = REVIEW_TYPE_LABELS[props.value];
    color = REVIEW_TYPE_COLORS[props.value];
  } else {
    label = AUTHOR_REVIEW_STATUS_LABELS[props.value];
    color = AUTHOR_REVIEW_STATUS_COLORS[props.value];
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
