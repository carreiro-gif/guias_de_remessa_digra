import React, { useState, useEffect } from "react";

import { Guia, Orgao, Operador, ResponsavelExterno, ServicoPreco } from "./types";
import { GuiaForm } from "./components/GuiaForm";
import { GuiaPrint } from "./components/GuiaPrint";
import { OrgaoManager } from "./components/OrgaoManager";
import { OperadorManager } from "./components/OperadorManager";
import { ResponsavelManager } from "./components/ResponsavelManager";
import { ServicoManager } from "./components/ServicoManager";

import {
  ORGAOS as INITIAL_ORGAOS,
  INITIAL_OPERADORES,
  INITIAL_RESPONSAVEIS,
  INITIAL_SERVICOS,
} from "./data/mockData";

import { upsertGuia } from "./services/firestore";

/* =======================================================================================
   ÍCONES
======================================================================================= */
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const IconList = IconPlus;
const IconBuilding = IconPlus;
const IconUsers = IconPlus;
const IconTruck = IconPlus;
const IconPrinter = IconPlus;
const IconTags = IconPlus;

/* =======================================================================================
   LOGO
======================================================================================= */
const LogoDigra = ({ size = "large" }: { size?: "small" | "large" }) => (
  <div
    className={`
      rounded-full bg-[#004aad] border-2 border-white 
      flex items-center justify-center font-bold text-white
      ${size === "large" ? "w-20 h-20 text-lg" : "w-10 h-10 text-[9px]"}
    `}
  >
    DIGRA
  </div>
);

/* =======================================================================================
   APP
======================================================================================= */
function App() {

  /* ================= TESTE FIRESTORE ================= */
  const testarFirestore = async () => {
    try {
      const sample = {
        numero: "TESTE-0001",
        dataEmissao: new Date().toISOString(),
        orgaoSnapshot: { nome: "ÓRGÃO TESTE", sigla: "TST" },
        solicitante: "Teste",
        observacoes: "Criado pelo botão de teste",
        responsaveisExternos: [],
        itens: [
          {
            quantidade: 1,
            servico: "Entrega",
            descricao: "Teste Firestore",
            operador: "Sistema",
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const id = await upsertGuia(sample as any);
      alert("🔥 FIRESTORE OK! Guia salva com ID: " + id);
    } catch (e) {
      console.error(e);
      alert("❌ Erro ao salvar no Firestore. Veja o console.");
    }
  };

  /* ================= STATES ================= */
  const [activeTab, setActiveTab] = useState<
    "list" | "form" | "orgaos" | "operadores" | "externos" | "servicos"
  >("list");

  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);
  const [editingGuia, setEditingGuia] = useState<Partial<Guia>>();
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= LOAD LOCAL ================= */
  useEffect(() => {
    setGuias(JSON.parse(localStorage.getItem("digra_guias") || "[]"));
    setOrgaos(JSON.parse(localStorage.getItem("digra_orgaos") || "null") || INITIAL_ORGAOS);
    setOperadores(JSON.parse(localStorage.getItem("digra_operadores") || "null") || INITIAL_OPERADORES);
    setResponsaveis(JSON.parse(localStorage.getItem("digra_responsaveis") || "null") || INITIAL_RESPONSAVEIS);
    setServicos(JSON.parse(localStorage.getItem("digra_servicos") || "null") || INITIAL_SERVICOS);
  }, []);

  /* ================= RENDER ================= */
      return (
    <div className="flex h-screen bg-slate-100">

      {/* BOTÃO DE TESTE – FIXO */}
      <button
        onClick={testarFirestore}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg font-bold"
      >
        TESTAR FIRESTORE
      </button>

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center">
          <LogoDigra />
          <h1 className="text-sm mt-3 font-bold tracking-wider">
            GUIAS DE REMESSA
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* TODO O SEU MENU CONTINUA IGUAL */}
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* TODO O RESTO DO SEU CÓDIGO CONTINUA IGUAL */}
        </div>
      </main>

      {printGuia && (
        <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />
      )}
    </div>
  );
}

export default App;
