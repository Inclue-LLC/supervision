import {
  SatoStatus,
  AuthorStatus,
  SATO_STATUS_LABELS,
  SATO_STATUS_COLORS,
  AUTHOR_STATUS_LABELS,
  AUTHOR_STATUS_COLORS,
} from "@/lib/types";

type Props =
  | { kind: "sato"; value: SatoStatus }
  | { kind: "author"; value: AuthorStatus };

export default function StatusBadge({ kind, value }: Props) {
  const label =
    kind === "sato" ? SATO_STATUS_LABELS[value as SatoStatus] : AUTHOR_STATUS_LABELS[value as AuthorStatus];
  const color =
    kind === "sato" ? SATO_STATUS_COLORS[value as SatoStatus] : AUTHOR_STATUS_COLORS[value as AuthorStatus];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
