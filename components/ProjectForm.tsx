"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Supervisor = { id: string; name: string };

type Props = {
  supervisors: Supervisor[];
  defaultValues?: {
    title?: string;
    description?: string;
    clientName?: string;
    deadline?: string;
    supervisorId?: string;
  };
  projectId?: string;
};

export default function ProjectForm({ supervisors, defaultValues, projectId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: defaultValues?.title ?? "",
    description: defaultValues?.description ?? "",
    clientName: defaultValues?.clientName ?? "",
    deadline: defaultValues?.deadline ?? "",
    supervisorId: defaultValues?.supervisorId ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        projectId ? `/api/projects/${projectId}` : "/api/projects",
        {
          method: projectId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "エラーが発生しました");
        return;
      }

      const project = await res.json();
      router.push(`/projects/${project.id}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          案件名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">依頼元</label>
          <input
            type="text"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">期限</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">監修者</label>
        <select
          value={form.supervisorId}
          onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">未割当</option>
          {supervisors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : projectId ? "更新する" : "登録する"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
