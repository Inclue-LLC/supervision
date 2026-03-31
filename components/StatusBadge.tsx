import {
  ReviewStatus,
  ReviewType,
  REVIEW_STATUS_LABELS,
  REVIEW_STATUS_COLORS,
  REVIEW_TYPE_LABELS,
  REVIEW_TYPE_COLORS,
} from "@/lib/types";

type Props =
  | { kind: "status"; value: ReviewStatus }
  | { kind: "type"; value: ReviewType };

export default function StatusBadge(props: Props) {
  const label =
    props.kind === "status"
      ? REVIEW_STATUS_LABELS[props.value]
      : REVIEW_TYPE_LABELS[props.value];
  const color =
    props.kind === "status"
      ? REVIEW_STATUS_COLORS[props.value]
      : REVIEW_TYPE_COLORS[props.value];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
