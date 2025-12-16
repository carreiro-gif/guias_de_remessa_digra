// src/services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

/**
 * Usa variáveis de ambiente do Vite (prefixo VITE_).
 * Crie um arquivo .env.local para testes locais com essas chaves
 * Ex.: VITE_FIREBASE_API_KEY="AIza...."
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

// Debug (temporário): se quiser ver no console em dev, use console.log(firebaseConfig)
if (import.meta.env.DEV) {
  console.log("[firebaseConfig] config:", {
    apiKeyPresent: !!firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
  });
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// tenta habilitar cache (IndexedDB) — falha só faz warn
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("IndexedDB persistence não habilitada:", err && err.message ? err.message : err);
});

export default app;
