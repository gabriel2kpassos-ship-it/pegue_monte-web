import Link from "next/link";
import { headers } from "next/headers";
import { KitTable } from "@/components/admin/KitTable";
import type { Kit } from "@/types/kit";

async function getRequestContext() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") || "";
  const safeHost = host || "localhost:3000";
  return { baseUrl: `${proto}://${safeHost}`, cookie };
}

export default async function AdminKitsPage() {
  const { baseUrl, cookie } = await getRequestContext();

  const res = await fetch(`${baseUrl}/admin/api/kits`, {
    cache: "no-store",
    headers: { cookie },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar kits (${res.status}): ${txt}`);
  }

  const data = (await res.json()) as { kits: Kit[] };
  const kits = data.kits;

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kits</h1>
        <Link
          href="/admin/kits/novo"
          className="rounded-xl bg-black px-5 py-2.5 text-white font-semibold"
        >
          + Novo kit
        </Link>
      </div>

      <KitTable kits={kits} />
    </main>
  );
}
