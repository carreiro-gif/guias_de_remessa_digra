import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbntaHfsUNK-dHUtS6aYp_CNi2b4jB2N8",
  authDomain: "guia-de-remessa-digra.firebaseapp.com",
  projectId: "guia-de-remessa-digra",
  storageBucket: "guia-de-remessa-digra.firebasestorage.app",
  messagingSenderId: "694403541232",
  appId: "1:694403541232:web:258e668cebff2dee5b3a35",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
