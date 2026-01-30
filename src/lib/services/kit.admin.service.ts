import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Kit } from "@/types/kit";

type KitInput = {
  nome: string;
  descricao?: string;
  preco?: number;
  ativo: boolean;
  ordem: number;
  fotoUrl?: string;
  fotoPublicId?: string;
};

export class KitAdminService {
  static async listAll(): Promise<Kit[]> {
    const q = query(collection(db, "kits"), orderBy("ordem", "asc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() as Omit<Kit, "id">;
      return { id: d.id, ...data };
    });
  }

  static async getById(id: string): Promise<Kit | null> {
    const ref = doc(db, "kits", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Omit<Kit, "id">;
    return { id: snap.id, ...data };
  }

  static async create(id: string, data: KitInput & { codigo: string }) {
    const ref = doc(db, "kits", id);
    await setDoc(
      ref,
      {
        ...data,
        createdAt: serverTimestamp(),
      },
      { merge: false }
    );
  }

  static async update(id: string, data: Partial<KitInput>) {
    const ref = doc(db, "kits", id);
    await updateDoc(ref, data);
  }

  static async setAtivo(id: string, ativo: boolean) {
    const ref = doc(db, "kits", id);
    await updateDoc(ref, { ativo });
  }

  static async setOrdem(id: string, ordem: number) {
    const ref = doc(db, "kits", id);
    await updateDoc(ref, { ordem });
  }
}
