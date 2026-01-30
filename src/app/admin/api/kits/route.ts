import { NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/auth/auth";
import admin from "firebase-admin";

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

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

async function nextKitCode(db: admin.firestore.Firestore) {
  const ref = db.collection("counters").doc("kits");
  const next = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      tx.set(
        ref,
        { value: 1, createdAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
      return 1;
    }
    const current = (snap.data()?.value ?? 0) as number;
    const value = current + 1;
    tx.set(ref, { value }, { merge: true });
    return value;
  });

  return `KIT-${pad3(next)}`;
}

export async function GET(req: Request) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const app = getAdminApp();
    const db = app.firestore();

    const snap = await db.collection("kits").orderBy("ordem", "asc").get();

   const kits = snap.docs.map((d) => {
  const data = d.data() as any;

  const createdAt =
    data.createdAt && typeof data.createdAt.toMillis === "function"
      ? data.createdAt.toMillis()
      : null;

  return { id: d.id, ...data, createdAt };
});


    return NextResponse.json({ kits });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const me = await requireAdmin(req);
    if (!me) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

    const body = (await req.json()) as {
      nome: string;
      descricao?: string;
      preco?: number;
      ativo?: boolean;
      fotoUrl?: string;
      fotoPublicId?: string;
    };

    if (!body?.nome?.trim()) {
      return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
    }

    const app = getAdminApp();
    const db = app.firestore();

    const codigo = await nextKitCode(db);
    const id = crypto.randomUUID();

    await db.collection("kits").doc(id).set({
      nome: body.nome.trim(),
      descricao: body.descricao?.trim() || "",
      preco: typeof body.preco === "number" ? body.preco : 0,

      codigo,
      ativo: body.ativo ?? true,
      ordem: Date.now(),

      fotoUrl: body.fotoUrl || "",
      fotoPublicId: body.fotoPublicId || "",

      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, id, codigo });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro" }, { status: 500 });
  }
}