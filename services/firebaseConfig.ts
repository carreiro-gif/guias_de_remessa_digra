// src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

/**
 * Usa variáveis de ambiente do Vite (prefixo VITE_).
 * Em produção no Vercel, defina essas chaves no painel de Environment Variables.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

// validação básica para ajudar a depuração
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // NÃO pare a aplicação em produção — apenas um aviso no console
  console.warn("[firebaseConfig] Variáveis de ambiente do Firebase parecem não estar definidas.");
}

// Inicializa app
const app = initializeApp(firebaseConfig);

// Inicializa Firestore preferindo a versão com cache persistente (modular)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Tenta habilitar persistence (IndexedDB) com fallback
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("IndexedDB persistence não habilitada:", err && err.message ? err.message : err);
});

// Export fallback clássico (caso precise de getFirestore)
export const dbFallback = getFirestore(app);
export default app;
