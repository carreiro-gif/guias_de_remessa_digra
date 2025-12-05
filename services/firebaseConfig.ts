
// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";

/**
 * Credenciais fornecidas por você (Firebase Console → Web App)
 * Em produção, o ideal é mover isso para variáveis de ambiente (posso te ajudar depois).
 */
const firebaseConfig = {
  apiKey: "AIzaSyDbntaHfsUNK-dHUtS6aYp_CNi2b4jB2N8",
  authDomain: "guia-de-remessa-digra.firebaseapp.com",
  projectId: "guia-de-remessa-digra",
  storageBucket: "guia-de-remessa-digra.firebasestorage.app",
  messagingSenderId: "694403541232",
  appId: "1:694403541232:web:258e668cebff2dee5b3a35",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

/**
 * Firestore com cache persistente local (offline → online),
 * e suporte multi-aba (evita conflitos quando duas abas estão abertas).
 */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Fallback: alguns navegadores requerem esta chamada explícita
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("IndexedDB persistence não habilitada (possível conflito de abas):", err);
});

// Se você precisar do getFirestore, exporte também:
export const dbFallback = getFirestore(app);
