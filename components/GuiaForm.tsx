
import React, { useState, useEffect } from 'react';
import { Orgao, ItemGuia, ServicoPreco, StatusServico, Guia, Operador, ResponsavelExterno } from '../types';

interface GuiaFormProps {
  initialData?: Partial<Guia>;
  onSave: (guia: Guia) => void;
  onCancel: () => void;
  onPrint: (guia: Guia) => void; // New prop
  suggestedNumber?: string;
  orgaosList: Orgao[];
  operadoresList: Operador[];
  responsaveisList: ResponsavelExterno[];
  servicosList: ServicoPreco[];
}

export const GuiaForm: React.FC<GuiaFormProps> = ({ 
  initialData, 
  onSave, 
  onCancel,
  onPrint,
  suggestedNumber,
  orgaosList, 
  operadoresList,
  responsaveisList,
  servicosList
}) => {
  const [selectedOrgaoId, setSelectedOrgaoId] = useState<string>(initialData?.orgaoId || '');
  const [solicitante, setSolicitante] = useState(initialData?.solicitante || '');
  const [observacoes, setObservacoes] = useState(initialData?.observacoes || '');
  const [items, setItems] = useState<ItemGuia[]>(initialData?.itens || []);
  const [selectedResponsaveis, setSelectedResponsaveis] = useState<string[]>(initialData?.responsaveisExternos || []);
  const [numeroGuia, setNumeroGuia] = useState<string>(initialData?.numero || suggestedNumber || '');
  
  // Search state for Org
  const [orgSearch, setOrgSearch] = useState('');

  // Initial org name population if editing
  useEffect(() => {
    if (initialData?.orgaoId) {
      const org = orgaosList.find(o => o.id === initialData.orgaoId);
      if (org) setOrgSearch(org.nome);
    }
  }, [initialData, orgaosList]);

  const handleAddItem = () => {
    const newItem: ItemGuia = {
      id: Math.random().toString(36).substr(2, 9),
      servicoId: '',
      descricao: '',
      detalhes: '',
      quantidade: 1,
      valorUnitario: 0,
      status: StatusServico.CONCLUIDO // Default to Concluido internally
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof ItemGuia, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-update price and description if serviceId changes
    if (field === 'servicoId') {
      const s = servicosList.find(serv => serv.id === value);
      if (s) {
        newItems[index].descricao = s.descricao;
        newItems[index].valorUnitario = s.valorUnitario;
      }
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleResponsavel = (nome: string) => {
    if (selectedResponsaveis.includes(nome)) {
      setSelectedResponsaveis(selectedResponsaveis.filter(n => n !== nome));
    } else {
      setSelectedResponsaveis([...selectedResponsaveis, nome]);
    }
  };

  const toggleAllResponsaveis = () => {
    if (selectedResponsaveis.length === responsaveisList.length) {
      setSelectedResponsaveis([]);
    } else {
      setSelectedResponsaveis(responsaveisList.map(r => r.nome));
    }
  };

  const constructGuia = (): Guia | null => {
    const orgao = orgaosList.find(o => o.id === selectedOrgaoId);
    if (!orgao) return null;
    
    return {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      numero: numeroGuia,
      dataEmissao: initialData?.dataEmissao || new Date().toISOString(),
      orgaoId: selectedOrgaoId,
      orgaoSnapshot: orgao,
      itens: items,
      observacoes,
      solicitante,
      responsaveisExternos: selectedResponsaveis
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return alert('Adicione pelo menos um item');
    
    const guia = constructGuia();
    if (!guia) return alert('Selecione um órgão válido');

    onSave(guia);
  };

  const handlePrintClick = () => {
    const guia = constructGuia();
    if (!guia) {
       alert('Preencha os dados do órgão antes de imprimir.');
       return;
    }
    onPrint(guia);
  };

  // Expanded Filter Logic: Name, Acronym, Address, Phone
  const filteredOrgs = orgSearch 
    ? orgaosList.filter(o => {
        const term = orgSearch.toLowerCase().trim();
        return (
          o.nome.toLowerCase().includes(term) || 
          o.sigla.toLowerCase().includes(term) ||
          (o.endereco && o.endereco.toLowerCase().includes(term)) ||
          (o.telefone && o.telefone.toLowerCase().includes(term))
        );
      })
    : orgaosList;

  // Sort operators alphabetically
  const sortedOperadores = [...operadoresList].sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {initialData ? 'Editar Guia' : 'Nova Guia de Remessa'}
        </h2>
        <div className="flex items-center gap-3">
           <button
             type="button"
             onClick={handlePrintClick}
             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
             Imprimir Guia
           </button>
           
           <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded border border-slate-200">
             <label className="text-xs font-bold text-slate-500 uppercase">Nº Guia:</label>
             <input 
               className="bg-white border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-900 w-28 text-center"
               value={numeroGuia}
               onChange={e => setNumeroGuia(e.target.value)}
             />
           </div>
        </div>
      </div>

      {/* Org Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1">Órgão Requisitante</label>
          <input 
            type="text"
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Busque por nome, sigla, endereço ou telefone..."
            value={orgSearch}
            onChange={(e) => {
              setOrgSearch(e.target.value);
              // Reset selection if typing creates mismatch
              if (selectedOrgaoId) setSelectedOrgaoId('');
            }}
          />
          {orgSearch && !selectedOrgaoId && (
            <div className="absolute z-50 bg-white border border-slate-200 mt-1 rounded-md shadow-xl max-h-64 overflow-auto w-full">
              {filteredOrgs.length > 0 ? filteredOrgs.map(o => (
                <div 
                  key={o.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
                  onClick={() => {
                    setSelectedOrgaoId(o.id);
                    setOrgSearch(o.nome);
                  }}
                >
                  <div className="text-sm font-bold text-slate-800">
                    {o.sigla} - {o.nome}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {o.endereco}
                    {o.telefone && <span className="ml-2 text-blue-600 font-medium">Tel: {o.telefone}</span>}
                  </div>
                </div>
              )) : (
                <div className="p-3 text-sm text-slate-500 text-center">Nenhum órgão encontrado com esses dados.</div>
              )}
            </div>
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Solicitante</label>
           <input 
            type="text"
            required
            className="w-full border border-slate-300 rounded-md p-2"
            value={solicitante}
            onChange={e => setSolicitante(e.target.value)}
            placeholder="Nome de quem pediu"
           />
        </div>
      </div>

      {selectedOrgaoId && (() => {
        const o = orgaosList.find(org => org.id === selectedOrgaoId);
        return o ? (
           <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm text-blue-800 border border-blue-100">
             <div className="flex justify-between items-start">
               <div>
                  <p><strong>Comarca:</strong> {o.comarca} | <strong>Fórum:</strong> {o.forum}</p>
                  <p><strong>Endereço:</strong> {o.endereco} {o.cep ? `| CEP: ${o.cep}` : ''}</p>
               </div>
               <div className="text-right">
                  <p className="bg-blue-200 px-2 py-1 rounded font-bold text-blue-900">{o.telefone || 'Sem telefone'}</p>
               </div>
             </div>
           </div>
        ) : null;
      })()}

      {/* Items Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-slate-700">Itens / Serviços</h3>
          <button 
            type="button" 
            onClick={handleAddItem}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            + Adicionar Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="border border-slate-200 p-4 rounded-md bg-slate-50 relative">
              <button 
                type="button" 
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
              >
                &times;
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="text-xs text-slate-500 block">Serviço</label>
                  <select 
                    className="w-full border border-slate-300 rounded p-1 text-sm"
                    value={item.servicoId}
                    onChange={(e) => updateItem(index, 'servicoId', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {servicosList.map(s => <option key={s.id} value={s.id}>{s.descricao}</option>)}
                    <option value="custom">Outro (Personalizado)</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                   <label className="text-xs text-slate-500 block">Qtd</label>
                   <input 
                      type="number" 
                      min="1"
                      className="w-full border border-slate-300 rounded p-1 text-sm"
                      value={item.quantidade}
                      onChange={(e) => updateItem(index, 'quantidade', parseInt(e.target.value))}
                   />
                </div>

                <div className="md:col-span-6">
                   <label className="text-xs text-slate-500 block">Detalhes (Formato, Gramatura, Cor)</label>
                   <input 
                      type="text" 
                      className="w-full border border-slate-300 rounded p-1 text-sm"
                      value={item.detalhes}
                      onChange={(e) => updateItem(index, 'detalhes', e.target.value)}
                      placeholder="Ex: Papel Couchê 150g, 4x0"
                   />
                </div>
                
                {/* Second Row for Operator */}
                <div className="md:col-span-12">
                  <label className="text-xs text-slate-500 block">Operador</label>
                  <select 
                     className="w-full border border-slate-300 rounded p-1 text-sm"
                     value={item.operador || ''}
                     onChange={(e) => updateItem(index, 'operador', e.target.value)}
                  >
                    <option value="">-- Selecione o Operador --</option>
                    {sortedOperadores.map(op => <option key={op.id} value={op.nome}>{op.nome}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Service Provider Selection */}
      <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-semibold text-slate-700">Serviço Externo Realizado Por:</label>
          <button 
            type="button" 
            onClick={toggleAllResponsaveis}
            className="text-xs text-blue-600 hover:underline"
          >
            {selectedResponsaveis.length === responsaveisList.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {responsaveisList.map(resp => (
            <label key={resp.id} className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={selectedResponsaveis.includes(resp.nome)}
                onChange={() => toggleResponsavel(resp.nome)}
              />
              <span className="text-sm text-slate-700">{resp.nome}</span>
            </label>
          ))}
          {responsaveisList.length === 0 && (
             <span className="text-xs text-slate-500 col-span-3">Nenhum responsável cadastrado. Vá em "Externos" para gerenciar.</span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-1">Observações Gerais</label>
        <textarea 
          className="w-full border border-slate-300 rounded p-2 text-sm h-20"
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md font-medium"
        >
          Salvar Guia
        </button>
      </div>

    </form>
  );
};
