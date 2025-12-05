
// src/types/firebase.ts
export interface Orgao {
  id?: string;
  nome: string;
  sigla: string;
  telefone?: string;
  endereco?: string;
  cep?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Servico {
  id?: string;
  nome: string;
  descricao?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Operador {
  id?: string;
  nome: string;
  matricula?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Externo {
  id?: string;
  nome: string;
  contato?: string;
  telefone?: string;
  createdAt?: number;
  updatedAt?: number;
}

/** Itens da guia (mapeamento: Qtde | Tipo | Descrição) */
export interface ItemGuiaFS {
  quantidade: number;   // Qtde
  servico?: string;     // Tipo (preferencial)
  descricao?: string;   // Tipo (se você ainda usa "descricao" como tipo)
  detalhes?: string;    // Descrição (coluna Descrição)
  operador?: string;    // controle interno (no-print)
}

/** Documento principal das Guias */
export interface GuiaFS {
  id?: string;            // espelho do numero
  numero: string;         // Nº da Guia (ID do documento para garantir unicidade)
  dataEmissao: string;    // ISO string (new Date().toISOString())
  orgaoSnapshot: {
    nome: string;
    sigla: string;
    telefone?: string;
    endereco?: string;
    cep?: string;
  };
  solicitante?: string;
  observacoes?: string;
  responsaveisExternos?: string[];  // “Serviço Externo Realizado Por”
  itens: ItemGuiaFS[];
  createdAt?: number;
  updatedAt?: number;
}
