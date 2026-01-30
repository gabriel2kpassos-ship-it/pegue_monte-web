import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";

function getSessionCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function requireAdmin(req: Request) {
  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) return null;

  const app = getAdminApp();
  const auth = app.auth();
  const decoded = await auth.verifySessionCookie(sessionCookie, true);

  const email = decoded.email || null;
  if (!isAllowedAdminEmail(email)) return null;

  return { email };
}

async function getId(ctx: { params: Promise<{ id: string }> | { id: string } }) {
  const p: any = (ctx as any).params;
  const resolved = typeof p?.then === "function" ? await p : p;
  const id = resolved?.id;

  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("Missing/invalid id param");
  }

  return id.trim();
}

function serializeTimestampToMillis(value: any): number | null {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") {
    // fallback (caso venha como objeto)
    return value.seconds * 1000;
  }
  return null;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    const docSnap = await db.collection("kits").doc(id).get();
    if (!docSnap.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const data = docSnap.data() as any;

    const createdAt = serializeTimestampToMillis(data.createdAt);
    // não apaga, só serializa
    const kit = { id: docSnap.id, ...data, createdAt };

    return NextResponse.json({ kit });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);

    const body = (await req.json()) as Record<string, any>;

    const allowed = ["nome", "descricao", "preco", "ativo", "ordem", "fotoUrl", "fotoPublicId"] as const;

    const update: Record<string, any> = {};

    for (const k of allowed) {
      if (!(k in body)) continue;

      const v = body[k];

      // evita mandar undefined (Firestore odeia)
      if (typeof v === "undefined") continue;

      if (k === "nome") update.nome = String(v).trim();
      else if (k === "descricao") update.descricao = String(v ?? "").trim();
      else if (k === "preco") update.preco = typeof v === "number" ? v : Number(v) || 0;
      else if (k === "ativo") update.ativo = Boolean(v);
      else if (k === "ordem") update.ordem = typeof v === "number" ? v : Number(v) || 0;
      else if (k === "fotoUrl") update.fotoUrl = String(v ?? "");
      else if (k === "fotoPublicId") update.fotoPublicId = String(v ?? "");
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("kits").doc(id).update(update);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const id = await getId(ctx);

    const app = getAdminApp();
    const db = app.firestore();

    await db.collection("kits").doc(id).delete();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}
