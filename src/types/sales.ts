export type SaleType = 'vista' | 'conta';
export type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

export type Product = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque_minimo: number;
};

export type Client = {
  id: number;
  nome: string;
  telefone?: string | null;
};

export type Account = {
  id: number;
  cliente_id: number;
  saldo_devedor: number;
  status: 'aberta' | 'fechada';
};

export type CartItem = {
  productId: number;
  nome: string;
  preco: number;
  quantidade: number;
  subtotal: number;
};

export type CreateSaleInput = {
  data?: string;
  tipo: 'vista' | 'conta';
  formaPagamento?: 'pix' | 'dinheiro' | 'cartao' | null;
  clienteId?: number | null;
  itens: CartItem[];
};

export type CreateSaleResult = {
  vendaId: number;
  contaId: number | null;
  total: number;
};

export type Sale = {
  id: number;
  data: string;
  valor_total: number;
  tipo: SaleType;
  forma_pagamento?: PaymentMethod | null;
  conta_id?: number | null;
};

export type SaleItem = {
  id: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
};