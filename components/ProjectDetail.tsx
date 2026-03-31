"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import {
  ProjectStatus,
  ContentStatus,
  PROJECT_STATUS_LABELS,
  CONTENT_STATUS_LABELS,
} from "@/lib/types";

type Supervisor = { id: string; name: string; email: string; [key: string]: unknown };
type Comment = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  supervisor: Supervisor | null;
  [key: string]: unknown;
};
type Content = {
  id: string;
  title: string;
  body: string | null;
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};
type Project = {
  id: string;
  title: string;
  description: string | null;
  clientName: string | null;
  deadline: string | null;
  status: string;
  supervisorId: string | null;
  supervisor: Supervisor | null;
  contents: Content[];
  comments: Comment[];
  [key: string]: unknown;
};

type Props = {
  project: Project;
  supervisors: Supervisor[];
};

export default function ProjectDetail({ project, supervisors }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(project.status as ProjectStatus);
  const [commentBody, setCommentBody] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(project.supervisorId ?? "");
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentBody, setNewContentBody] = useState("");
  const [showContentForm, setShowContentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>(project.comments);
  const [contents, setContents] = useState<Content[]>(project.contents);

  async function updateStatus(newStatus: ProjectStatus) {
    setStatus(newStatus);
    await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        clientName: project.clientName,
        deadline: project.deadline,
        supervisorId: selectedSupervisor || null,
        status: newStatus,
      }),
    });
    router.refresh();
  }

  async function updateSupervisor(supervisorId: string) {
    setSelectedSupervisor(supervisorId);
    await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: project.title,
        description: project.description,
        clientName: project.clientName,
        deadline: project.deadline,
        supervisorId: supervisorId || null,
        status,
      }),
    });
    router.refresh();
  }

  async function addComment() {
    if (!commentBody.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: commentBody,
        projectId: project.id,
        supervisorId: selectedSupervisor || null,
      }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setCommentBody("");
    }
    setLoading(false);
  }

  async function deleteComment(id: string) {
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
    setComments(comments.filter((c) => c.id !== id));
  }

  async function addContent() {
    if (!newContentTitle.trim()) return;
    setLoading(true);

    // Use project API to add content via a separate API route
    const res = await fetch(`/api/projects/${project.id}/contents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newContentTitle, body: newContentBody }),
    });
    if (res.ok) {
      const content = await res.json();
      setContents([content, ...contents]);
      setNewContentTitle("");
      setNewContentBody("");
      setShowContentForm(false);
    }
    setLoading(false);
  }

  async function updateContentStatus(contentId: string, newStatus: ContentStatus) {
    const res = await fetch(`/api/projects/${project.id}/contents/${contentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setContents(
        contents.map((c) => (c.id === contentId ? { ...c, status: newStatus } : c))
      );
    }
  }

  async function deleteProject() {
    if (!confirm("この案件を削除しますか？")) return;
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    router.push("/projects");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/projects" className="hover:text-gray-900">案件管理</Link>
        <span>/</span>
        <span className="text-gray-900">{project.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
          {project.description && (
            <p className="text-gray-500 text-sm mt-1">{project.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {project.clientName && <span>依頼元: {project.clientName}</span>}
            {project.deadline && (
              <span>期限: {new Date(project.deadline).toLocaleDateString("ja-JP")}</span>
            )}
          </div>
        </div>
        <button
          onClick={deleteProject}
          className="text-red-500 text-sm hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          削除
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">ステータス・進捗</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    status === s
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {PROJECT_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Contents */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">コンテンツ</h3>
              <button
                onClick={() => setShowContentForm(!showContentForm)}
                className="text-sm text-blue-600 hover:underline"
              >
                + 追加
              </button>
            </div>

            {showContentForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="コンテンツタイトル"
                  value={newContentTitle}
                  onChange={(e) => setNewContentTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="内容（任意）"
                  value={newContentBody}
                  onChange={(e) => setNewContentBody(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addContent}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setShowContentForm(false)}
                    className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {contents.length === 0 ? (
              <p className="text-sm text-gray-500">コンテンツがまだありません</p>
            ) : (
              <div className="space-y-3">
                {contents.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        v{c.version} · {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={c.status}
                        onChange={(e) => updateContentStatus(c.id, e.target.value as ContentStatus)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none"
                      >
                        {(Object.keys(CONTENT_STATUS_LABELS) as ContentStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {CONTENT_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <StatusBadge type="content" status={c.status as ContentStatus} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              コメント・フィードバック
            </h3>
            <div className="mb-4 space-y-2">
              <textarea
                placeholder="コメントを入力..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addComment}
                disabled={loading || !commentBody.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                コメントを追加
              </button>
            </div>

            {comments.length === 0 ? (
              <p className="text-sm text-gray-500">コメントがまだありません</p>
            ) : (
              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {c.supervisor?.name ?? "匿名"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                        </span>
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">監修者</h3>
            <select
              value={selectedSupervisor}
              onChange={(e) => updateSupervisor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">未割当</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {project.supervisor && (
              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium">{project.supervisor.name}</p>
                <p className="text-xs text-gray-400">{project.supervisor.email}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">現在のステータス</h3>
            <StatusBadge type="project" status={status} />
          </div>

          <Link
            href={`/projects/${project.id}/edit`}
            className="block w-full text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            案件を編集
          </Link>
        </div>
      </div>
    </div>
  );
}
