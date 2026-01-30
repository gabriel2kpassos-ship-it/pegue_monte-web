import Link from "next/link";
import { notFound } from "next/navigation";
import type { Kit } from "@/types/kit";
import { KitService } from "@/lib/services/kit.service";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

export default async function KitPage({ params }: { params: { id: string } }) {
  const kit: Kit | null = await KitService.getPublicById(params.id);
  if (!kit) return notFound();

  const pageUrl = `http://localhost:3000/catalogo/kits/${kit.id}`;
const waLink = buildWhatsAppLink({
  nome: kit.nome,
  codigo: kit.codigo || "SEM-CODIGO",
  link: pageUrl,
  fotoUrl: kit.fotoUrl || "",
});
  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex items-center justify-between gap-3">
          <Button href="/catalogo" variant="outline">
            ← Voltar
          </Button>
          <Badge>{kit.codigo || "KIT"}</Badge>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border bg-gray-50 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={kit.fotoUrl || "/file.svg"}
              alt={kit.nome}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{kit.nome}</h1>

            {kit.descricao ? (
              <p className="mt-4 text-gray-700 leading-relaxed">{kit.descricao}</p>
            ) : (
              <p className="mt-4 text-gray-500">Sem descrição.</p>
            )}

            <div className="mt-8">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-pink-400 to-sky-400 px-6 py-4 text-lg font-extrabold text-white shadow-lg transition hover:opacity-95 active:scale-[0.99]"
              >
                Solicitar orçamento no WhatsApp
              </a>

              <p className="mt-3 text-sm text-gray-500">
                A mensagem já vai com o item, código, link e foto.
              </p>
            </div>

            <div className="mt-10 rounded-3xl border bg-gradient-to-br from-pink-50 via-white to-sky-50 p-5">
              <p className="text-sm font-semibold text-gray-900">
                Dica rápida:
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Preencha “Data do evento” e “Bairro/Cidade” no WhatsApp para agilizar o orçamento.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
