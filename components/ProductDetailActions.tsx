"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { productId: string; isCompleted: boolean };

export default function ProductDetailActions({ productId, isCompleted }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleCompleted() {
    if (
      !confirm(
        isCompleted
          ? "校了済みを解除して進行中に戻しますか？"
          : "このサンプルを校了済みにしますか？"
      )
    )
      return;
    setLoading(true);
    await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !isCompleted }),
    });
    router.refresh();
    setLoading(false);
  }

  async function deleteProduct() {
    if (!confirm("この商品を削除しますか？全ての監修データも削除されます。")) return;
    setLoading(true);
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2">
      {isCompleted ? (
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
          ✓ 校了済み
        </span>
      ) : null}
      <button
        onClick={toggleCompleted}
        disabled={loading}
        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
          isCompleted
            ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? "..." : isCompleted ? "進行中に戻す" : "校了済みにする"}
      </button>
      <button
        onClick={deleteProduct}
        disabled={loading}
        className="text-sm text-red-400 hover:text-red-600 px-2 py-2"
      >
        削除
      </button>
    </div>
  );
}
