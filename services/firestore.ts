// src/services/firestore.ts
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // relativo ao arquivo acima
import type { GuiaFS, Orgao, Servico, Operador, Externo } from "../types/firebase";

const now = () => Date.now();

// coleções
const col = {
  guias: collection(db, "guias"),
  orgaos: collection(db, "orgaos"),
  servicos: collection(db, "servicos"),
  operadores: collection(db, "operadores"),
  externos: collection(db, "externos"),
};

/** Upsert de guia (usa numero como id) */
export async function upsertGuia(guia: GuiaFS): Promise<string> {
  const numero = (guia.numero || "").toString().trim();
  if (!numero) throw new Error("Número da Guia obrigatório.");

  const ref = doc(db, "guias", numero);
  const payload: GuiaFS = {
    ...guia,
    id: numero,
    createdAt: guia.createdAt || now(),
    updatedAt: now(),
  };

  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

/** obter guia por numero */
export async function obterGuiaPorNumero(numero: string): Promise<GuiaFS | null> {
  const ref = doc(db, "guias", numero);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as GuiaFS;
}

/** listar (por createdAt desc) */
export async function listarGuias(limitCount = 200): Promise<GuiaFS[]> {
  const q = query(col.guias, orderBy("createdAt", "desc"));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => d.data() as GuiaFS).slice(0, limitCount);
}

/** snapshot real-time */
export function ouvirGuias(callback: (guias: GuiaFS[]) => void): () => void {
  const q = query(col.guias, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snaps) => {
    callback(snaps.docs.map(d => d.data() as GuiaFS));
  });
}

// Exporte também as funções de orgaos/servicos/operadores se usar no app.
// (adicione conforme necessário)
export async function salvarOrgao(orgao: Orgao): Promise<string> {
  const id = (orgao.sigla || orgao.nome).trim().toUpperCase();
  const ref = doc(db, "orgaos", id);
  const payload = { ...orgao, createdAt: orgao.createdAt || now(), updatedAt: now() };
  await setDoc(ref, payload, { merge: true });
  return ref.id;
}
