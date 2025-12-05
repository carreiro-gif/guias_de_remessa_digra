import React, { useState, useEffect } from 'react';
import { obterGuiaPorNumero } from "../services/firestore";
import type { GuiaFS } from "../types/firebase"; // Usaremos este tipo para a guia encontrada
// Mantenha seus tipos locais se ainda precisar deles para outras coisas, mas GuiaFS será o principal aqui
import { Guia, ItemGuia } from '../types'; 

/**
 * URL da logomarca PJERJ (fornecida por você).
 */
const LOGO_URL =
  'https://raw.githubusercontent.com/carreiro-gif/digra-logo-TJ/refs/heads/main/logo_tjrj.png';

// Removemos as props antigas (guia, onClose) e criamos um componente que gerencia seu próprio estado de busca
export const GuiaPrint: React.FC = () => {
  // Fonte da logo com cache-busting (mantido da sua versão original)
  const [logoSrc, setLogoSrc] = useState(`${LOGO_URL}?ts=${Date.now()}`);
  
  // ---> INÍCIO DO CÓDIGO NOVO (Lógica de Busca - Passo 2) <---
  const [numeroBusca, setNumeroBusca] = useState('');
  const [guiaEncontrada, setGuiaEncontrada] = useState<GuiaFS | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscarGuia = async (numero: string) => {
    setErro(null); // Limpa erros anteriores
    // setGuiaEncontrada(null); // Opcional: limpa a guia anterior durante a busca
    
    if (!numero) {
        setErro("Por favor, insira um número de guia.");
        return;
    }

    try {
      const guia = await obterGuiaPorNumero(numero);
      
      if (!guia) {
        setErro(`Guia Nº ${numero} não encontrada.`);
        setGuiaEncontrada(null); // Garante que a interface de detalhes não apareça
      } else {
        setGuiaEncontrada(guia);
      }
      
    } catch (e) {
      console.error("Erro ao buscar guia:", e);
      setErro("Ocorreu um erro ao buscar a guia.");
      setGuiaEncontrada(null);
    }
  };
  // ---> FIM DO CÓDIGO NOVO (Lógica de Busca) <---

  // Removemos o useEffect de auto-print que dependia da prop 'guia' antiga, 
  // pois agora a impressão deve ser manual após a busca.
  // useEffect apenas para renovar a logo:
  useEffect(() => {
    const handleRefresh = () => {
        setLogoSrc(`${LOGO_URL}?ts=${Date.now()}`);
    };
    // Opcional: Chame handleRefresh se quiser garantir que a logo carregue
    // handleRefresh(); 
  }, []);


  // Tudo que está abaixo do return() é a interface visual (JSX)
  return (
    <div className="p-4"> {/* Adicionei um padding básico aqui */}
      
      {/* ---> INÍCIO DO CÓDIGO NOVO (Interface do Usuário - Passo 3) <--- */}
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Buscar / Imprimir Guia</h1>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Digite o número da guia (ex: 2025/0001)"
                value={numeroBusca}
                onChange={(e) => setNumeroBusca(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button 
                onClick={() => buscarGuia(numeroBusca)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Buscar
            </button>
        </div>
      </div>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {guiaEncontrada && (
        // Esta div representa a área que você pode querer estilizar para impressão
        <div id="printable-area" className="border p-4 shadow-lg bg-white">
          <h2>Detalhes da Guia Nº {guiaEncontrada.numero}</h2>
          <img src={logoSrc} alt="Logo TJERJ" style={{ maxWidth: '150px' }} />
          <p>Cliente: {guiaEncontrada.cliente}</p>
          <p>Órgão: {guiaEncontrada.orgaoSnapshot?.nome}</p>
          {/* Adicione mais detalhes conforme seu tipo GuiaFS */}
          <button 
            onClick={() => window.print()}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Imprimir Guia
          </button>
        </div>
      )}
      {/* ---> FIM DO CÓDIGO NOVO (Interface do Usuário) <--- */}

    </div>
  );
};

export default GuiaPrint;


  const handleRefresh = () => {
    // Atualiza timestamp para renovar a logo
    setLogoSrc(`${LOGO_URL}?ts=${Date.now()}`);
    if (typeof (window as any).updatePreview === 'function') {
      (window as any).updatePreview();
    }
  };

  // Paginação
  const ITEMS_PER_PAGE_NORMAL = 10;
  const ITEMS_PER_PAGE_WITH_FOOTER = 5; // última página com recibo

  const pages = useMemo(() => {
    const _pages: PageChunk[] = [];
    let remaining = [...guia.itens];
    let pageCount = 1;

    if (remaining.length === 0) {
      _pages.push({ items: [], isLast: true, pageNumber: 1 });
      return _pages;
    }

    while (true) {
      // Cabe na última página com rodapé (recibo)?
      if (remaining.length <= ITEMS_PER_PAGE_WITH_FOOTER) {
        _pages.push({ items: remaining, isLast: true, pageNumber: pageCount });
        break;
      }
      // Página normal
      const chunk = remaining.slice(0, ITEMS_PER_PAGE_NORMAL);
      remaining = remaining.slice(ITEMS_PER_PAGE_NORMAL);
      const isExhausted = remaining.length === 0;

      _pages.push({
        items: chunk,
        isLast: isExhausted,
        pageNumber: pageCount,
      });
      pageCount++;

      if (isExhausted) {
        // cria mais uma página somente para o rodapé/recibo
        _pages[_pages.length - 1].isLast = false;
        _pages.push({ items: [], isLast: true, pageNumber: pageCount });
        break;
      }
    }

    return _pages;
  }, [guia.itens]);

  const totalPages = pages.length;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 overflow-auto flex justify-center py-8">
      {/* ===== Parte 1: Estilos A5 atualizados ===== */}
      <style>{`
        /* Configurações básicas para a visualização na tela (preview) */
        .print-page {
          width: 148mm;          /* Largura A5 retrato */
          min-height: 210mm;     /* Altura A5 retrato */
          margin: 10mm auto;     /* Centraliza a página na tela com margens visuais de 10mm */
          padding: 10mm;         /* Margem interna (conteúdo) de 10mm */
          box-sizing: border-box;
          background: white;     /* Garante fundo branco na tela */
        }

        /* Importante:
         * A instrução original sugeria .no-print { display: none } fora do @media print,
         * o que esconderia os elementos também na tela. Para manter "visível na tela e oculto na impressão",
         * NÃO aplicamos .no-print aqui. Somente dentro de @media print.
         */

        /* Evita rolagem forçada/material clipado no preview */
        .print-root {
          overflow: visible !important;
        }

        /* --- REGRAS ESPECÍFICAS PARA IMPRESSÃO --- */
        @media print {
          /* A5 retrato e remoção de margens padrão do navegador
             A margem efetiva (10mm) está no padding de .print-page */
          @page {
            size: A5 portrait;
            margin: 0mm;
          }

          body {
            /* Força P&B na impressão */
            filter: grayscale(100%);
          }

          .print-page {
            width: 148mm;
            height: 210mm;
            min-height: 210mm;
            margin: 0mm;          /* sem margem externa na folha */
            padding: 10mm;        /* margem interna de 10mm */
            box-sizing: border-box;
            position: relative;   /* evita quebra de fixed na impressão */
            overflow: hidden;     /* previne barras e cortes indesejados */
          }

          /* Evita quebra dentro dos blocos de topo/tabela/rodapé */
          .print-page header,
          .print-page table,
          .print-page footer {
            page-break-inside: avoid;
          }

          /* Oculta elementos marcados para não imprimir */
          .no-print {
            display: none !important;
          }

          /* Ajuste fino de legibilidade */
          .text-[9px]  { font-size: 8px;  }
          .text-[10px] { font-size: 9px;  }
          .text-[11px] { font-size: 10px; }
          .text-xl     { font-size: 1.125rem; }
        }
      `}</style>

      {/* Controles flutuantes (ficam visíveis na tela, ocultos na impressão via .no-print em @media print) */}
      <div className="fixed top-4 right-4 z-50 no-print flex gap-2">
        <button
          onClick={handleRefresh}
          id="btn-refresh"
          className="bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 font-bold flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          Atualizar Preview
        </button>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 font-bold flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect width="12" height="8" x="6" y="14" />
          </svg>
          Imprimir A5
        </button>

        <button
          onClick={onClose}
          className="bg-white text-slate-800 px-6 py-3 rounded-full shadow-lg hover:bg-slate-100 font-bold"
        >
          Fechar
        </button>
      </div>

      <div className="print-root flex flex-col gap-8 print:gap-0">
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            className="print-page shadow-2xl print:shadow-none bg-white text-black font-sans"
          >
            {/* --- HEADER --- */}
            <header className="flex flex-row items-center border-b border-black pb-4 mb-4">
              {/* Logo (Parte 3: usa URL fornecida e remove placeholder) */}
              <div className="w-[20%] flex justify-start items-center pl-2">
                <img
                  id="logo-pjerj"
                  src={logoSrc}
                  alt="Brasão RJ"
                  className="w-auto h-auto object-contain"
                  style={{ maxHeight: '24mm', filter: 'grayscale(100%) contrast(110%)' }} // P&B na tela
                  crossOrigin="anonymous"
                />
              </div>

              {/* Texto institucional (uppercase via CSS, conteúdo exato) */}
              <div className="w-[55%] text-[9px] font-bold leading-tight uppercase text-center flex flex-col justify-center">
                <span>PODER JUDICIÁRIO DO ESTADO DO RIO DE JANEIRO</span>
                <span>DIRETORIA GERAL DE LOGÍSTICA</span>
                <span>DEPARTAMENTO DE PATRIMÔNIO E MATERIAL</span>
                <span className="mt-1">DIVISÃO DE PRODUÇÃO GRÁFICA (DIGRA)</span>
              </div>

              {/* Metadata (Parte 2: numeração com no-print para ocultar somente na impressão) */}
              <div className="w-[25%] text-right flex flex-col justify-center text-[10px] pr-2">
                <div className="font-bold">
                  Nº da Guia: <span className="text-sm">{guia.numero}</span>
                </div>
                <div>Data: {new Date(guia.dataEmissao).toLocaleDateString('pt-BR')}</div>
                <div className="text-[8px] mt-1 text-gray-500 no-print">
                  Pág. {page.pageNumber}/{totalPages}
                </div>
              </div>
            </header>

            {/* Título (Parte 2: reduzir de text-xl para text-lg) */}
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold uppercase border border-black inline-block px-8 py-1 tracking-wider">
                GUIA
              </h1>
            </div>

            {/* --- INFO BLOCKS --- */}
            <section className="text-[11px] mb-4 space-y-1 px-2">
              <div className="flex">
                <span className="font-bold w-28">Órgão Requisitante:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">
                  {guia.orgaoSnapshot.nome} ({guia.orgaoSnapshot.sigla})
                </span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Contato:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">
                  {guia.solicitante || ''}
                </span>
                <span className="font-bold ml-2 mr-1">Tel:</span>
                <span className="border-b border-dotted border-gray-400 min-w-[80px]">
                  {guia.orgaoSnapshot.telefone || ''}
                </span>
              </div>
              <div className="flex">
                <span className="font-bold w-28">Endereço:</span>
                <span className="uppercase flex-1 border-b border-dotted border-gray-400">
                  {guia.orgaoSnapshot.endereco}{' '}
                  {guia.orgaoSnapshot.cep ? `- CEP: ${guia.orgaoSnapshot.cep}` : ''}
                </span>
              </div>
            </section>

            {/* --- TABLE --- */}
            <div className="flex-1 flex flex-col px-2">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-black">
                    <th className="text-center py-1 border-r border-black w-[15%] font-bold">Qtde</th>
                    <th className="text-left px-2 py-1 border-r border-black w-[25%] font-bold">Tipo</th>
                    <th className="text-left px-2 py-1 w-[60%] font-bold">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {page.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-300 last:border-black">
                      {/* Qtde = item.quantidade */}
                      <td className="text-center py-2 border-r border-black align-top font-medium">
                        {item.quantidade}
                      </td>
                      {/* Tipo = item.descricao (se seu tipo estiver em item.servico, ajuste aqui) */}
                      <td className="px-2 py-2 border-r border-black align-top font-medium">
                        {item.descricao}
                      </td>
                      {/* Descrição = item.detalhes */}
                      <td className="px-2 py-2 align-top">
                        <div className="font-normal text-[10px]">{item.detalhes || '-'}</div>

                        {/* Campos internos (devem estar ocultos na impressão) */}
                        {item.operador && (
                          <div className="no-print mt-1 p-1 bg-yellow-100 text-[9px] border border-yellow-300 rounded text-yellow-800">
                            <strong>(Controle Interno)</strong> Operador: {item.operador}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Preenche espaço em página somente rodapé (continuação) */}
                  {page.items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center italic text-gray-500">
                        -- Continuação --
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {!page.isLast && (
                <div className="mt-2 text-right text-[9px] italic">Continua na próxima página...</div>
              )}
            </div>

            {/* --- FOOTER (RECIBO) - somente última página --- */}
            {page.isLast && (
              <footer className="mt-auto pt-2 px-2 pb-2">
                {/* Observações (opcional, esconde se vazio) + Controle interno (no-print) */}
                {(guia.observacoes || (guia.responsaveisExternos && guia.responsaveisExternos.length > 0)) && (
                  <div className="mb-4 border border-black p-2 text-[10px]">
                    {guia.observacoes && (
                      <div className="mb-2">
                        <div className="font-bold mb-1">OBSERVAÇÕES:</div>
                        <div className="whitespace-pre-wrap leading-tight">{guia.observacoes}</div>
                      </div>
                    )}

                    {guia.responsaveisExternos && guia.responsaveisExternos.length > 0 && (
                      <div className="no-print mt-2 pt-2 border-t border-dotted border-yellow-500 bg-yellow-50 p-1 text-yellow-900">
                        <span className="font-bold text-[9px] uppercase">
                          (Controle Interno) Serviço Externo:
                        </span>{' '}
                        {guia.responsaveisExternos.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Bloco de recebimento */}
                <div className="border border-black p-2">
                  <h3 className="text-center font-bold text-[11px] uppercase mb-4 bg-gray-100 border-b border-black -mx-2 -mt-2 py-1">
                    Recebimento
                  </h3>
                  <div className="space-y-3 text-[10px]">
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Nome:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Matrícula/RG:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="w-16 font-bold shrink-0">Cargo:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                      <div className="w-10 font-bold shrink-0 text-right">Data:</div>
                      <div className="w-24 border-b border-black h-4"></div>
                    </div>
                    <div className="flex gap-4 items-end pt-2">
                      <div className="w-16 font-bold shrink-0">Assinatura:</div>
                      <div className="flex-1 border-b border-black h-4"></div>
                    </div>
                  </div>
                </div>

                {/* Rodapé do site - Parte 2: ocultar na impressão (no-print) */}
                <div className="text-[8px] text-center mt-2 font-medium no-print">
                  DIGRA - Sistema de Gestão de Remessa
                </div>
              </footer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
