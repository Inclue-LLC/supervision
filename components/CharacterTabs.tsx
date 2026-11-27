"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { ReviewType, ReviewStatus, AuthorReviewStatus } from "@/lib/types";

type Product = {
  id: string;
  name: string;
  type: ReviewType;
  status: ReviewStatus;
  satoNote: string | null;
  authorStatus: AuthorReviewStatus;
  authorNote: string | null;
  licenseeInfo: string | null;
};

type Character = {
  id: string;
  name: string;
  requiresAuthorReview: boolean;
  allProducts: Product[];
};

export default function CharacterTabs({ characters }: { characters: Character[] }) {
  const [activeId, setActiveId] = useState(characters[0]?.id ?? "");

  const active = characters.find((c) => c.id === activeId);

  return (
    <div>
      <div className="flex gap-0.5 border-b border-gray-200 mb-6 overflow-x-auto">
        {characters.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeId === c.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {c.name}
            {c.allProducts.length > 0 && (
              <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                {c.allProducts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {active && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">{active.name}</h2>
              {active.requiresAuthorReview && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  作家監修あり
                </span>
              )}
            </div>
            <Link
              href={`/characters/${active.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              商品・地域を管理 →
            </Link>
          </div>

          {active.allProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              進行中の商品はありません
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      商品名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分類
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      区分
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      佐藤監修
                    </th>
                    {active.requiresAuthorReview && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        作家監修
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {active.allProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        {p.satoNote && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-48">{p.satoNote}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {p.licenseeInfo ?? "自社製造"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="type" value={p.type} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge kind="status" value={p.status} />
                      </td>
                      {active.requiresAuthorReview && (
                        <td className="px-4 py-3">
                          {p.authorStatus === "NOT_REQUIRED" ? (
                            <span className="text-xs text-gray-300">—</span>
                          ) : (
                            <div>
                              <StatusBadge kind="authorStatus" value={p.authorStatus} />
                              {p.authorNote && (
                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-36">{p.authorNote}</p>
                              )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
