import Link from "next/link";
import type { Kit } from "@/types/kit";
import { KitService } from "@/lib/services/kit.service";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

export default async function CatalogoPage() {
  const kits: Kit[] = await KitService.listPublicActive();

  return (
    <main className="min-h-screen bg-white py-10">
      <Container>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Catálogo de Kits
            </h1>
            <p className="mt-2 text-gray-600">
              Escolha um kit e clique para ver detalhes e pedir orçamento.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/" variant="outline">
              Voltar
            </Button>
            <Button href="/contato">Falar no WhatsApp</Button>
          </div>
        </div>

        {kits.length === 0 ? (
          <div className="mt-10 rounded-3xl border bg-gradient-to-br from-pink-50 via-white to-sky-50 p-8">
            <p className="text-gray-700 font-semibold">
              Nenhum kit ativo no momento.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Assim que os itens forem publicados no admin, eles aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kits.map((k) => (
              <Link key={k.id} href={`/catalogo/kits/${k.id}`} className="block">
                <Card className="group">
                  <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={k.fotoUrl || "/file.svg"}
                      alt={k.nome}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-extrabold text-gray-900">
                        {k.nome}
                      </h2>
                      <Badge>{k.codigo || "KIT"}</Badge>
                    </div>

                    {k.descricao ? (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {k.descricao}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">Sem descrição.</p>
                    )}

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700">
                      Ver detalhes <span className="transition group-hover:translate-x-0.5">→</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
