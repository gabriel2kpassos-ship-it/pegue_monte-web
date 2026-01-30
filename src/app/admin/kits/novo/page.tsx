"use client";

import { useRouter } from "next/navigation";
import { KitForm } from "@/components/admin/KitForm";

export default function NovoKitPage() {
  const router = useRouter();

  async function createKit(data: {
    nome: string;
    descricao?: string;
    preco?: number;
    ativo: boolean;
  }) {
    const res = await fetch("/admin/api/kits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || "Falha ao criar kit");
    }

    router.push("/admin/kits");
  }

  return (
    <main className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Novo Kit</h1>
      <KitForm onSubmit={createKit} />
    </main>
  );
}
