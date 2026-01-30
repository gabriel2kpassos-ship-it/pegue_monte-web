import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { KitForm } from "@/components/admin/KitForm";
import { DeleteKitButton } from "@/components/admin/DeleteKitButton";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host") || "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  return { baseUrl: `${proto}://${host}`, cookie };
}

export default async function EditarKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/kits/${id}`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (res.status === 404) return notFound();
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar kit (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { kit: any };
  const kit = data.kit;

  async function updateKit(form: {
    nome: string;
    descricao?: string;
    preco?: number;
    ativo: boolean;
  }) {
    "use server";

    const { baseUrl, cookie } = await getRequestContext();

    const r = await fetch(`${baseUrl}/admin/api/kits/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
      body: JSON.stringify(form),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      throw new Error(`Falha ao atualizar (${r.status}): ${txt}`);
    }

    redirect("/admin/kits");
  }

  return (
    <main className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Editar Kit</h1>
        <DeleteKitButton id={id} />
      </div>

      <KitForm initialData={kit} onSubmit={updateKit} />
    </main>
  );
}
