import React, { useState, useEffect } from 'react';
import { Guia, Orgao, Operador, ResponsavelExterno, ServicoPreco } from './types';
import { GuiaForm } from './components/GuiaForm';
import { GuiaPrint } from './components/GuiaPrint';
import { OrgaoManager } from './components/OrgaoManager';
import { OperadorManager } from './components/OperadorManager';
import { ResponsavelManager } from './components/ResponsavelManager';
import { ServicoManager } from './components/ServicoManager';

import {
  ORGAOS as INITIAL_ORGAOS,
  INITIAL_OPERADORES,
  INITIAL_RESPONSAVEIS,
  INITIAL_SERVICOS
} from './data/mockData';

// 🔥 IMPORTAÇÃO DO FIRESTORE (CORRETA)
import { upsertGuia } from "./services/firestore";

// ==== ÍCONES ====
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
const IconList = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconBuilding = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="18" x2="9" y2="18.01"/><line x1="15" y1="18" x2="15" y2="18.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconTruck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><line x1="16" y1="8" x2="20" y2="8"/><line x1="16" y1="16" x2="23" y2="16"/><path d="M16 12h7"/></svg>;
const IconPrinter = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const IconTags = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

// ==== LOGO ====
const LogoDigra = ({ size = 'large' }: { size?: 'small' | 'large' }) => (
  <div 
    className={`
      rounded-full bg-[#004aad] border-2 border-white 
      flex items-center justify-center font-bold text-white tracking-widest
      shadow-md ring-2 ring-[#004aad]
      ${size === 'large' ? 'w-20 h-20 text-lg' : 'w-10 h-10 text-[9px]'}
    `}
  >
    DIGRA
  </div>
);

function App() {

  // ==== FIRESTORE TEST FUNCTION (NOVO) ====
  const testarFirestore = async () => {
    try {
      const sample = {
        numero: "TESTE-0001",
        dataEmissao: new Date().toISOString(),
        orgaoSnapshot: { nome: "ORGAO TESTE", sigla: "TST" },
        solicitante: "Fulano",
        observacoes: "Teste Firebase",
        responsaveisExternos: [],
        itens: [
          {
            quantidade: 1,
            servico: "Entrega",
            descricao: "Teste",
            detalhes: "",
            operador: "Operador Teste"
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const id = await upsertGuia(sample as any);
      alert("🔥 Funcionou! Guia salva com ID: " + id);
    } catch (err: any) {
      console.error(err);
      alert("❌ Erro ao testar Firestore — veja o console (F12)");
    }
  };

  // ======= ESTADOS PRINCIPAIS =======
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'orgaos' | 'operadores' | 'externos' | 'servicos'>('list');
  const [guias, setGuias] = useState<Guia[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [responsaveis, setResponsaveis] = useState<ResponsavelExterno[]>([]);
  const [servicos, setServicos] = useState<ServicoPreco[]>([]);
  
  const [editingGuia, setEditingGuia] = useState<Partial<Guia> | undefined>(undefined);
  const [printGuia, setPrintGuia] = useState<Guia | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // === LocalStorage Load ===
  useEffect(() => {
    const saved = localStorage.getItem("digra_guias");
    if (saved) setGuias(JSON.parse(saved));

    setOrgaos(JSON.parse(localStorage.getItem("digra_orgaos") || "null") || INITIAL_ORGAOS);
    setOperadores(JSON.parse(localStorage.getItem("digra_operadores") || "null") || INITIAL_OPERADORES);
    setResponsaveis(JSON.parse(localStorage.getItem("digra_responsaveis") || "null") || INITIAL_RESPONSAVEIS);
    setServicos(JSON.parse(localStorage.getItem("digra_servicos") || "null") || INITIAL_SERVICOS);
  }, []);

  // === LocalStorage Save ===
  useEffect(() => localStorage.setItem("digra_guias", JSON.stringify(guias)), [guias]);
  useEffect(() => localStorage.setItem("digra_orgaos", JSON.stringify(orgaos)), [orgaos]);
  useEffect(() => localStorage.setItem("digra_operadores", JSON.stringify(operadores)), [operadores]);
  useEffect(() => localStorage.setItem("digra_responsaveis", JSON.stringify(responsaveis)), [responsaveis]);
  useEffect(() => localStorage.setItem("digra_servicos", JSON.stringify(servicos)), [servicos]);

  // === Funções auxiliares ===
  const getNextGuiaNumber = () => {
    const year = new Date().getFullYear();
    const prefix = `${year}/`;
    const yearGuias = guias.filter(g => g.numero.startsWith(prefix));
    
    if (!yearGuias.length) return `${prefix}0001`;

    const maxSeq = Math.max(...yearGuias.map(g => parseInt(g.numero.split('/')[1])));
    return `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;
  };

  const handleSaveGuia = (guia: Guia) => {
    const exists = guias.some(g => g.id === guia.id);
    setGuias(exists ? guias.map(g => g.id === guia.id ? guia : g) : [guia, ...guias]);
    setActiveTab('list');
    setEditingGuia(undefined);
  };

  const handleDeleteGuia = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta guia?")) {
      setGuias(guias.filter(g => g.id !== id));
    }
  };

  const filteredGuias = guias.filter(g =>
    g.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">

      {/* ========== BOTÃO FIREBASE PARA TESTES ========== */}
      <button
        onClick={testarFirestore}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
          padding: "10px 16px",
          background: "#2563eb",
          color: "white",
          borderRadius: 8,
          border: "none",
          fontWeight: "bold",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)"
        }}
      >
        TESTAR FIREBASE
      </button>

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-700 flex flex-col items-center">
          <LogoDigra />
          <h1 className="text-sm mt-3 font-bold tracking-wider">GUIAS DE REMESSA</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => { setActiveTab('form'); setEditingGuia(undefined); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'form' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <IconPlus /> Nova Guia
          </button>

          <button onClick={() => setActiveTab('list')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'list' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <IconList /> Histórico
          </button>

          <div className="pt-4 border-t border-slate-700 mt-4">
            <p className="px-4 mb-2 text-xs uppercase text-slate-500 font-bold">Cadastros</p>

            <button onClick={() => setActiveTab('orgaos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'orgaos' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
              <IconBuilding /> Órgãos
            </button>

            <button onClick={() => setActiveTab('servicos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'servicos' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
              <IconTags /> Serviços
            </button>

            <button onClick={() => setActiveTab('operadores')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'operadores' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
              <IconUsers /> Operadores
            </button>

            <button onClick={() => setActiveTab('externos')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded transition-colors ${activeTab === 'externos' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
              <IconTruck /> Externos
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">

          {activeTab === 'form' && (
            <GuiaForm
              initialData={editingGuia}
              suggestedNumber={getNextGuiaNumber()}
              onSave={handleSaveGuia}
              onCancel={() => setActiveTab('list')}
              onPrint={(g) => setPrintGuia(g)}
              orgaosList={orgaos}
              operadoresList={operadores}
              responsaveisList={responsaveis}
              servicosList={servicos}
            />
          )}

          {activeTab === 'orgaos' && (
            <OrgaoManager
              orgaos={orgaos}
              onSave={(o) => setOrgaos([...orgaos.filter(x => x.id !== o.id), o])}
              onDelete={(id) => setOrgaos(orgaos.filter(x => x.id !== id))}
            />
          )}

          {activeTab === 'operadores' && (
            <OperadorManager
              operadores={operadores}
              onSave={(o) => setOperadores([...operadores.filter(x => x.id !== o.id), o])}
              onDelete={(id) => setOperadores(operadores.filter(x => x.id !== id))}
            />
          )}

          {activeTab === 'externos' && (
            <ResponsavelManager
              responsaveis={responsaveis}
              onSave={(o) => setResponsaveis([...responsaveis.filter(x => x.id !== o.id), o])}
              onDelete={(id) => setResponsaveis(responsaveis.filter(x => x.id !== id))}
            />
          )}

          {activeTab === 'servicos' && (
            <ServicoManager
              servicos={servicos}
              onSave={(s) => setServicos([...servicos.filter(x => x.id !== s.id), s])}
              onDelete={(id) => setServicos(servicos.filter(x => x.id !== id))}
            />
          )}

          {activeTab === 'list' && (
            <div>
              <h2 className="text-2xl mb-4 font-bold">Histórico de Guias</h2>

              <input
                className="p-2 border rounded mb-4 w-full"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />

              <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Número</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Órgão</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Itens</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGuias.map(guia => (
                      <tr key={guia.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold">{guia.numero}</td>
                        <td className="px-6 py-4">{new Date(guia.dataEmissao).toLocaleDateString()}</td>
                        <td className="px-6 py-4">{guia.orgaoSnapshot.sigla}</td>
                        <td className="px-6 py-4">{guia.itens.length} itens</td>

                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 mr-3" onClick={() => setPrintGuia(guia)}>
                            <IconPrinter />
                          </button>

                          <button className="text-indigo-600 mr-3"
                            onClick={() => { setEditingGuia(guia); setActiveTab('form'); }}>
                            Editar
                          </button>

                          <button className="text-red-600"
                            onClick={() => handleDeleteGuia(guia.id)}>
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredGuias.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-gray-400">
                          Nenhuma guia encontrada.
                        </td>
                      </tr>
                    )}
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

export default App;
