"use client";

import { useState } from "react";
import type { Kit } from "@/types/kit";
import { ImageUploader } from "./ImageUploader";

type Props = {
  initialData?: Kit | null;
  onSubmit: (data: {
    nome: string;
    descricao?: string;
    preco?: number;
    ativo: boolean;
    fotoUrl?: string;
    fotoPublicId?: string;
  }) => Promise<void>;
};

export function KitForm({ initialData, onSubmit }: Props) {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [descricao, setDescricao] = useState(initialData?.descricao || "");
  const [preco, setPreco] = useState<number>(initialData?.preco || 0);
  const [ativo, setAtivo] = useState(initialData?.ativo ?? true);

  const [fotoUrl, setFotoUrl] = useState<string>(initialData?.fotoUrl || "");
  const [fotoPublicId, setFotoPublicId] = useState<string>(
    initialData?.fotoPublicId || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco,
        ativo,
        fotoUrl: fotoUrl || undefined,
        fotoPublicId: fotoPublicId || undefined,
      });
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-sm font-semibold">Nome do kit</label>
        <input
          className="mt-1 w-full rounded-xl border px-4 py-3"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Descrição</label>
        <textarea
          className="mt-1 w-full rounded-xl border px-4 py-3"
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Preço (opcional)</label>
        <input
          type="number"
          className="mt-1 w-full rounded-xl border px-4 py-3"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Foto</label>
        <div className="mt-2">
          <ImageUploader
            value={fotoUrl || undefined}
            onUploaded={({ url, publicId }) => {
              setFotoUrl(url);
              setFotoPublicId(publicId);
            }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Recomendado: imagem quadrada (1:1) ou 4:5.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
        />
        <span className="text-sm">Kit ativo (aparece no site)</span>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        disabled={loading}
        className="rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-6 py-3 font-bold text-white disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}