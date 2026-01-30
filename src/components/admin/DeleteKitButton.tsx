"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteKitButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    const ok = confirm("Tem certeza que deseja excluir este kit? Essa ação não tem volta.");
    if (!ok) return;

    setLoading(true);
    try {
      const r = await fetch(`/admin/api/kits/${id}`, { method: "DELETE" });

      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(txt || "Falha ao excluir");
      }

      router.push("/admin/kits");
      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Erro ao excluir");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
    >
      {loading ? "Excluindo..." : "Excluir kit"}
    </button>
  );
}
