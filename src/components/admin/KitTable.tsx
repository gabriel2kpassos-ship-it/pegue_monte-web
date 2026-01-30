"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Kit } from "@/types/kit";

export function KitTable({ kits }: { kits: Kit[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleAtivo(id: string, ativoAtual: boolean) {
    setLoadingId(id);
    try {
      const r = await fetch(`/admin/api/kits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativoAtual }),
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(txt || "Falha ao atualizar");
      }

      router.refresh();
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-4 py-3 text-sm font-semibold bg-gray-50">
        <div className="col-span-6">Kit</div>
        <div className="col-span-3">Código</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-right">Ações</div>
      </div>

      <div className="divide-y">
        {kits.map((k) => (
          <div key={k.id} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
            <div className="col-span-6 flex items-center gap-3">
              {k.fotoUrl ? (
                <img
                  src={k.fotoUrl}
                  alt={k.nome}
                  className="h-12 w-12 rounded-xl object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl border bg-gray-50" />
              )}

              <div className="min-w-0">
                <div className="font-semibold truncate">{k.nome}</div>
                {k.descricao ? (
                  <div className="text-xs text-gray-500 truncate">{k.descricao}</div>
                ) : null}
              </div>
            </div>

            <div className="col-span-3 text-sm text-gray-700">{k.codigo}</div>

            <div className="col-span-2">
              <button
                type="button"
                disabled={loadingId === k.id}
                onClick={() => toggleAtivo(k.id, Boolean(k.ativo))}
                className={[
                  "rounded-xl px-3 py-1.5 text-xs font-bold border transition disabled:opacity-60",
                  k.ativo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
                ].join(" ")}
              >
                {loadingId === k.id ? "Salvando..." : k.ativo ? "ATIVO" : "INATIVO"}
              </button>
            </div>

            <div className="col-span-1 text-right">
              <Link
                href={`/admin/kits/${k.id}`}
                className="text-sm font-semibold underline"
              >
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>

      {kits.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">Nenhum kit cadastrado.</div>
      ) : null}
    </div>
  );
}
