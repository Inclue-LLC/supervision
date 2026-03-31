"use client";

import { useRouter } from "next/navigation";

export default function SupervisorActions({ supervisorId }: { supervisorId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("この監修者を削除しますか？")) return;
    await fetch(`/api/supervisors/${supervisorId}`, { method: "DELETE" });
    router.push("/supervisors");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 text-sm hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      削除
    </button>
  );
}
