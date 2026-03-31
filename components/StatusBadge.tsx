import {
  ProjectStatus,
  ContentStatus,
  PROJECT_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  CONTENT_STATUS_COLORS,
} from "@/lib/types";

type Props =
  | { type: "project"; status: ProjectStatus }
  | { type: "content"; status: ContentStatus };

export default function StatusBadge(props: Props) {
  const label =
    props.type === "project"
      ? PROJECT_STATUS_LABELS[props.status]
      : CONTENT_STATUS_LABELS[props.status];
  const color =
    props.type === "project"
      ? PROJECT_STATUS_COLORS[props.status]
      : CONTENT_STATUS_COLORS[props.status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
