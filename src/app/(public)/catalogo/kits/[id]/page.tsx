import Link from "next/link";
import { notFound } from "next/navigation";
import { KitService } from "@/lib/services/kit.service";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";

export const dynamic = "force-dynamic";

export default async function PublicKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const kit = await KitService.getPublicById(id);
  if (!kit) return notFound();

  const link = `/catalogo/kits/${kit.id}`;
  const wa = buildWhatsAppLink({
    nome: kit.nome,
    codigo: kit.codigo || `KIT-${kit.id.slice(0, 3).toUpperCase()}`,
    link: link,
    fotoUrl: kit.fotoUrl || "",
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/catalogo/kits"
          className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Voltar para o catálogo
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border bg-gray-50">
            {kit.fotoUrl ? (
              <img src={kit.fotoUrl} alt={kit.nome} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-[360px] w-full items-center justify-center text-sm text-gray-400">
                Sem foto
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{kit.nome}</h1>
            <div className="mt-2 text-sm font-bold text-gray-500">{kit.codigo}</div>

            {kit.descricao ? (
              <p className="mt-4 text-base text-gray-700 whitespace-pre-line">{kit.descricao}</p>
            ) : null}

            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-400 to-sky-400 px-6 py-4 text-base font-extrabold text-white shadow-md hover:opacity-95"
            >
              Solicitar orçamento no WhatsApp
            </a>

            <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-gray-600">
              Dica: envie a data do evento e o bairro/cidade para agilizar.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
