import Link from "next/link";
import { KitService } from "@/lib/services/kit.service";

export const dynamic = "force-dynamic";

export default async function PublicKitsPage() {
  const kits = await KitService.listPublicActive();

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Catálogo de Kits</h1>
            <p className="mt-2 text-sm text-gray-600">
              Escolha um kit e peça orçamento no WhatsApp.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            Voltar
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kits.map((k) => (
            <Link
              key={k.id}
              href={`/catalogo/kits/${k.id}`}
              className="group rounded-3xl border bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-50">
                {k.fotoUrl ? (
                  <img
                    src={k.fotoUrl}
                    alt={k.nome}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-lg font-bold text-gray-900">{k.nome}</div>
                <div className="mt-1 text-xs font-semibold text-gray-500">{k.codigo}</div>
                {k.descricao ? (
                  <div className="mt-2 line-clamp-2 text-sm text-gray-600">{k.descricao}</div>
                ) : null}

                <div className="mt-4 inline-flex items-center rounded-xl bg-gradient-to-r from-pink-400 to-sky-400 px-4 py-2 text-sm font-bold text-white">
                  Ver detalhes
                </div>
              </div>
            </Link>
          ))}
        </div>

        {kits.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-gray-50 p-6 text-sm text-gray-600">
            Nenhum kit ativo ainda. Cadastre no admin e ative.
          </div>
        ) : null}
      </section>
    </main>
  );
}
