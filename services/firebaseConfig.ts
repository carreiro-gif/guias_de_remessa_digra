// src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  enableIndexedDbPersistence,
  getFirestore,
} from "firebase/firestore";

/**
 * Use variáveis de ambiente para deploy (Vite -> import.meta.env.VITE_*)
 * Em desenvolvimento ele usará as chaves hardcoded como fallback.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDbntaHfsUNK-dHUtS6aYp_CNi2b4jB2N8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "guia-de-remessa-digra.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "guia-de-remessa-digra",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "guia-de-remessa-digra.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "694403541232",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:694403541232:web:258e668cebff2dee5b3a35",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore com cache persistente (offline)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Tentativa de habilitar persistence (falha é tratada)
enableIndexedDbPersistence(db).catch((err) => {
  // Conflito multi-aba ou navegadores sem suporte
  console.warn("IndexedDB persistence não habilitada:", err && err.message ? err.message : err);
});

// Export fallback getFirestore se precisar
export const dbFallback = getFirestore(app);
