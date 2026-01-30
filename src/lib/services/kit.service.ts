import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Kit } from "@/types/kit";

export class KitService {
  static async listPublicActive(): Promise<Kit[]> {
    const q = query(
      collection(db, "kits"),
      where("ativo", "==", true),
      orderBy("ordem", "asc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() as Omit<Kit, "id">;
      return { id: d.id, ...data };
    });
  }

  static async getPublicById(id: string): Promise<Kit | null> {
    const ref = doc(db, "kits", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as Omit<Kit, "id">;
    if (!data.ativo) return null;

    return { id: snap.id, ...data };
  }
}
