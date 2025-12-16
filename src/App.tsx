// NOVO CODIGO App.tsx OTIMIZADO
import React, { useEffect, useState, Fragment } from "react";
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

const Icon = () => (
  <svg xmlns="www.w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

const Logo = () => (
  <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold">DIGRA</div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<"list" | "form" | "orgaos" | "operadores" | "externos" | "servicos">("list");
  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);

  useEffect(() => {
    setGuias(JSON.parse(localStorage.getItem("digra_guias") || "[]"));
    setOrgaos(JSON.parse(localStorage.getItem("digra_orgaos") || "null") || INITIAL_ORGAOS);
    setOperadores(JSON.parse(localStorage.getItem("digra_operadores") || "null") || INITIAL_OPERADORES);
    setResponsaveis(JSON.parse(localStorage.getItem("digra_responsaveis") || "null") || INITIAL_RESPONSAVEIS);
    setServicos(JSON.parse(localStorage.getItem("digra_servicos") || "null") || INITIAL_SERVICOS);
  }, []);

  useEffect(() => {
    localStorage.setItem("digra_guias", JSON.stringify(guias));
  }, [guias]);

  // Refatoração para garantir que a estrutura do return seja robusta
  const renderContent = () => {
    switch (activeTab) {
      case "form":
        return (
          <GuiaForm
            onSave={(g) => setGuias([g, ...guias])}
            onCancel={() => setActiveTab("list")}
            onPrint={(g) => setPrintGuia(g)}
            orgaosList={orgaos}
            operadoresList={operadores}
            responsaveisList={responsaveis}
            servicosList={servicos}
          />
        );
      case "orgaos":
        return <OrgaoManager data={orgaos} setData={setOrgaos} />;
      case "operadores":
        return <OperadorManager data={operadores} setData={setOperadores} />;
      case "externos":
        return <ResponsavelManager data={responsaveis} setData={setResponsaveis} />;
      case "servicos":
        return <ServicoManager data={servicos} setData={setServicos} />;
      case "list":
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Guias</h2>
            <ul className="space-y-2">
              {guias.map((g) => (
                <li key={g.id} className="bg-white p-3 rounded shadow flex justify-between">
                  <span>{g.numero}</span>
                  <button onClick={() => setPrintGuia(g)}>Imprimir</button>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* BARRA LATERAL (Nova localização, longe da linha 197 anterior) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700 flex justify-center">
          <Logo />
        </div>
        <nav className="p-4 space-y-2">
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("form")}><Icon /> Nova Guia</button>
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("list")}><Icon /> Histórico</button>
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("orgaos")}><Icon /> Órgãos</button>
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("servicos")}><Icon /> Serviços</button>
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("operadores")}><Icon /> Operadores</button>
          <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-800" onClick={() => setActiveTab("externos")}><Icon /> Externos</button>
        </nav>
      </aside>

      {/* CONTENT (Agora usa a função renderContent) */}
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>

      {printGuia && <GuiaPrint guia={printGuia} onClose={() => setPrintGuia(null)} />}
    </div>
  );
}
