
// src/services/firestore.ts
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { GuiaFS, Orgao, Servico, Operador, Externo } from "../types/firebase";

const now = () => Date.now();

// Coleções raiz
const col = {
  guias: collection(db, "guias"),
  orgaos: collection(db, "orgaos"),
  servicos: collection(db, "servicos"),
  operadores: collection(db, "operadores"),
  externos: collection(db, "externos"),
};

/** ========================= GUIAS (principal) ========================= **/

/**
 * Cria/atualiza uma Guia usando o número como ID (garante unicidade).
 * Se o doc já existe, faz merge (não perde campos existentes).
 */
export async function upsertGuia(guia: GuiaFS): Promise<string> {
  const numero = guia.numero.trim();
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

/** Obtém uma Guia pelo número (ID do doc) */
export async function obterGuiaPorNumero(numero: string): Promise<GuiaFS | null> {
  const ref = doc(db, "guias", numero);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as GuiaFS;
}

/** Lista Guias (ordenadas por createdAt desc) — leitura única */
export async function listarGuias(limitCount = 200): Promise<GuiaFS[]> {
  const q = query(col.guias, orderBy("createdAt", "desc"));
  const snaps = await getDocs(q);
  const all = snaps.docs.map(d => d.data() as GuiaFS);
  return all.slice(0, limitCount);
}

/** Inscrição em tempo real (multiusuário): atualiza entre computadores */
export function ouvirGuias(callback: (guias: GuiaFS[]) => void): () => void {
  const q = query(col.guias, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snaps) => {
    const list = snaps.docs.map(d => d.data() as GuiaFS);
    callback(list);
  });
}

/** Atualiza parcialmente uma Guia (mantém o ID único) */
export async function atualizarGuia(numero: string, parcial: Partial<GuiaFS>): Promise<void> {
  const ref = doc(db, "guias", numero);
  await updateDoc(ref, { ...parcial, updatedAt: now() });
}

/** Exclui Guia pelo número (ID) */
export async function excluirGuia(numero: string): Promise<void> {
  await deleteDoc(doc(db, "guias", numero));
}

/** ========================= ÓRGÃOS ========================= **/

export async function salvarOrgao(orgao: Orgao): Promise<string> {
  // ID legível opcional: use a sigla como ID; senão usa o nome
  const id = (orgao.sigla || orgao.nome).trim().toUpperCase();
  const ref = doc(db, "orgaos", id);
  const payload: Orgao = { ...orgao, createdAt: orgao.createdAt || now(), updatedAt: now() };
  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

export async function listarOrgaos(): Promise<Orgao[]> {
  const snaps = await getDocs(query(col.orgaos, orderBy("nome", "asc")));
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Orgao) }));
}

export async function atualizarOrgao(id: string, parcial: Partial<Orgao>): Promise<void> {
  await updateDoc(doc(db, "orgaos", id), { ...parcial, updatedAt: now() });
}

export async function excluirOrgao(id: string): Promise<void> {
  await deleteDoc(doc(db, "orgaos", id));
}

/** ========================= SERVIÇOS ========================= **/

export async function salvarServico(servico: Servico): Promise<string> {
  const id = servico.nome.trim().toLowerCase().replace(/\s+/g, "-");
  const ref = doc(db, "servicos", id);
  const payload: Servico = { ...servico, createdAt: servico.createdAt || now(), updatedAt: now() };
  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

export async function listarServicos(): Promise<Servico[]> {
  const snaps = await getDocs(query(col.servicos, orderBy("nome", "asc")));
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Servico) }));
}

export async function atualizarServico(id: string, parcial: Partial<Servico>): Promise<void> {
  await updateDoc(doc(db, "servicos", id), { ...parcial, updatedAt: now() });
}

export async function excluirServico(id: string): Promise<void> {
  await deleteDoc(doc(db, "servicos", id));
}

/** ========================= OPERADORES ========================= **/

export async function salvarOperador(op: Operador): Promise<string> {
  const id = (op.matricula || op.nome).trim();
  const ref = doc(db, "operadores", id);
  const payload: Operador = { ...op, createdAt: op.createdAt || now(), updatedAt: now() };
  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

export async function listarOperadores(): Promise<Operador[]> {
  const snaps = await getDocs(query(col.operadores, orderBy("nome", "asc")));
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Operador) }));
}

export async function atualizarOperador(id: string, parcial: Partial<Operador>): Promise<void> {
  await updateDoc(doc(db, "operadores", id), { ...parcial, updatedAt: now() });
}

export async function excluirOperador(id: string): Promise<void> {
  await deleteDoc(doc(db, "operadores", id));
}

/** ========================= EXTERNOS ========================= **/

export async function salvarExterno(ex: Externo): Promise<string> {
  const id = ex.nome.trim().toLowerCase().replace(/\s+/g, "-");
  const ref = doc(db, "externos", id);
  const payload: Externo = { ...ex, createdAt: ex.createdAt || now(), updatedAt: now() };
  await setDoc(ref, payload, { merge: true });
  return ref.id;
}

export async function listarExternos(): Promise<Externo[]> {
  const snaps = await getDocs(query(col.externos, orderBy("nome", "asc")));
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as Externo) }));
}

export async function atualizarExterno(id: string, parcial: Partial<Externo>): Promise<void> {
  await updateDoc(doc(db, "externos", id), { ...parcial, updatedAt: now() });
}

export async function excluirExterno(id: string): Promise<void> {
  await deleteDoc(doc(db, "externos", id));
}
