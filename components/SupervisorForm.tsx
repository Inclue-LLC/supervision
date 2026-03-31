"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  defaultValues?: {
    name?: string;
    email?: string;
    affiliation?: string;
    specialty?: string;
    bio?: string;
  };
  supervisorId?: string;
};

export default function SupervisorForm({ defaultValues, supervisorId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: defaultValues?.name ?? "",
    email: defaultValues?.email ?? "",
    affiliation: defaultValues?.affiliation ?? "",
    specialty: defaultValues?.specialty ?? "",
    bio: defaultValues?.bio ?? "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        supervisorId ? `/api/supervisors/${supervisorId}` : "/api/supervisors",
        {
          method: supervisorId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "エラーが発生しました");
        return;
      }

      const supervisor = await res.json();
      router.push(`/supervisors/${supervisor.id}`);
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            氏名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所属</label>
          <input
            type="text"
            value={form.affiliation}
            onChange={(e) => setForm({ ...form, affiliation: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">専門分野</label>
          <input
            type="text"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : supervisorId ? "更新する" : "登録する"}
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
