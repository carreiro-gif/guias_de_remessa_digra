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

// ========================================================================================
// ÍCONES
// ========================================================================================
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

// ========================================================================================
// LOGO
// ========================================================================================
const LogoDigra = ({ size = "large" }: { size?: "small" | "large" }) => (
  <div
    className={`rounded-full bg-[#004aad] border-2 border-white flex items-center justify-center font-bold text-white tracking-widest shadow-md ring-2 ring-[#004aad] ${
      size === "large" ? "w-20 h-20 text-lg" : "w-10 h-10 text-[9px]"
    }`}
  >
    DIGRA
  </div>
);

// ========================================================================================
// APP
// ========================================================================================
export default function App() {
  const [activeTab, setActiveTab] = useState<
    "list" | "form" | "orgaos" | "operadores" | "externos" | "servicos"
  >("list");

  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);

  const [editingGuia, setEditingGuia] = useState<Partial<Guia> | undefined>();
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ======================================================================================
  // LOAD LOCAL STORAGE
  // ======================================================================================
  useEffect(() => {
    setGuias(JSON.parse(localStorage.getItem("digra_guias") || "[]"));
    setOrgaos(JSON.parse(localStorage.getItem("digra_orgaos") || "null") || INITIAL_ORGAOS);
    setOperadores(JSON.parse(localStorage.getItem("digra_operadores") || "null") || INITIAL_OPERADORES);
    setResponsaveis(JSON.parse(localStorage.getItem("digra_responsaveis") || "null") || INITIAL_RESPONSAVEIS);
    setServicos(JSON.parse(localStorage.getItem("digra_servicos") || "null") || INITIAL_SERVICOS);
  }, []);

  // ======================================================================================
  // SAVE LOCAL STORAGE
  // ======================================================================================
  useEffect(() => localStorage.setItem("digra_guias", JSON.stringify(guias)), [guias]);
  useEffect(() => localStorage.setItem("digra_orgaos", JSON.stringify(orgaos)), [orgaos]);
  useEffect(() => localStorage.setItem("digra_operadores", JSON.stringify(operadores)), [operadores]);
  useEffect(() => localStorage.setItem("digra_responsaveis", JSON.stringify(responsaveis)), [responsaveis]);
  useEffect(() => localStorage.setItem("digra_servicos", JSON.stringify(servicos)), [servicos]);

  // ======================================================================================
  // HELPERS
  // ======================================================================================
  const getNextGuiaNumber = () => {
    const year = new Date().getFullYear();
    const prefix = `${year}/`;
    const doAno = guias.filter((g) => (g.numero || "").startsWith(prefix));
    if (!doAno.length) return `${prefix}0001`;
    const max = Math.max(...doAno.map((g) => parseInt(g.numero.split("/")[1], 10)));
    return `${prefix}${String(max + 1).padStart(4, "0")}`;
  };

  const handleSaveGuia = (guia: Guia) => {
    const exists = guias.some((g) => g.id === guia.id);
    setGuias(exists ? guias.map((g) => (g.id === guia.id ? guia : g)) : [guia, ...guias]);
    setActiveTab("list");
  };

  const handleDeleteGuia = (id: string) => {
    if (window.confirm("Deseja excluir esta guia?")) {
      setGuias(guias.filter((g) => g.id !== id));
    }
  };

  const filteredGuias = guias.filter((g) =>
    (g.numero || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================================================================================
  // RENDER
  // ======================================================================================
  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center">
          <LogoDigra />
          <h1 className="text-sm mt-3 font-bold tracking-wider">GUIAS DE REMESSA</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab("form"); setEditingGuia(undefined); }} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
            <IconPlus /> Nova Guia
          </button>

          <button onClick={() => setActiveTab("list")} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
            <IconList /> Histórico
          </button>

          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="px-4 mb-2 text-xs uppercase text-slate-500 font-bold">Cadastros</p>

            <button onClick={() => setActiveTab("orgaos")} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
              <IconBuilding /> Órgãos
            </button>

            <button onClick={() => setActiveTab("servicos")} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
              <IconTags /> Serviços
            </button>

            <button onClick={() => setActiveTab("operadores")} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
              <IconUsers /> Operadores
            </button>

            <button onClick={() => setActiveTab("externos")} className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-slate-800">
              <IconTruck /> Externos
            </button>
          </div>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === "form" && (
            <GuiaForm
              initialData={editingGuia}
              suggestedNumber={getNextGuiaNumber()}
              onSave={handleSaveGuia}
              onCancel={() => setActiveTab("list")}
              onPrint={(g) => setPrintGuia(g)}
              orgaosList={orgaos}
              operadoresList={operadores}
              responsaveisList={responsaveis}
              servicosList={servicos}
            />
          )}

          {activeTab === "list" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Histórico de Guias</h2>
              <input className="p-2 border rounded mb-4 w-full" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

              <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    {filteredGuias.map((guia) => (
                      <tr key={guia.id}>
                        <td className="px-4 py-2 font-bold">{guia.numero}</td>
                        <td className="px-4 py-2">{guia.orgaoSnapshot?.sigla}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => setPrintGuia(guia)}><IconPrinter /></button>
                          <button onClick={() => { setEditingGuia(guia); setActiveTab("form"); }}>Editar</button>
                          <button onClick={() => handleDeleteGuia(guia.id)}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {printGuia && <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />}
    </div>
  );
}
