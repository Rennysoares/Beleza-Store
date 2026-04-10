import { getAll, getFirst, run } from '../db';
import { CartItem, PaymentMethod, Sale, SaleItem, SaleType } from '../../types/sales';

type CreateSaleDBInput = {
  data?: string;
  valorTotal: number;
  tipo: SaleType;
  formaPagamento?: PaymentMethod | null;
  contaId?: number | null;
};

export const salesRepository = {

  /**
   * Registra uma nova venda
   * @param data Dados referente a venda
   * @returns Identificador da venda realizada
   */
  createSale(data: CreateSaleDBInput): number {
    const result = run(`
      INSERT INTO vendas (data, valor_total, tipo, forma_pagamento, conta_id)
      VALUES (?, ?, ?, ?, ?)
    `, [
      data.data ?? new Date().toISOString(),
      data.valorTotal,
      data.tipo,
      data.formaPagamento ?? null,
      data.contaId ?? null
    ]);

    return result.lastInsertRowId as number;
  },

  /**
   * Retorna todas as vendas registradas no banco de dados
   * @returns Vetor contendo todas as vendas registadas
   */
  getAllSales(): Sale[] {
    return getAll<Sale>(`
      SELECT * FROM vendas
      ORDER BY id DESC
    `);
  },

  /**
   * Retorna uma venda registada no sistema
   * @param vendaId Identificador da venda criada
   * @returns Dados da venda ou null caso não exista
   */
  getSaleById(vendaId: number): Sale | null {
    return getFirst<Sale>(`
      SELECT * FROM vendas
      WHERE id = ?
    `, [vendaId]);
  },

  getByAccountId(accountId: number): Sale[] {
    return getAll<Sale>(`
    SELECT * FROM vendas
    WHERE conta_id = ?
    ORDER BY data DESC
  `, [accountId]);
  },
};