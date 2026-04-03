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

  createSaleItem(vendaId: number, item: CartItem): void {
    run(`
      INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario, subtotal)
      VALUES (?, ?, ?, ?, ?)
    `, [
      vendaId,
      item.productId,
      item.quantidade,
      item.preco,
      item.subtotal
    ]);
  },

  getAllSales(): Sale[] {
    return getAll<Sale>(`
      SELECT * FROM vendas
      ORDER BY id DESC
    `);
  },

  getSaleById(vendaId: number): Sale | null {
    return getFirst<Sale>(`
      SELECT * FROM vendas
      WHERE id = ?
    `, [vendaId]);
  },

  getSaleItems(vendaId: number): SaleItem[] {
    return getAll<SaleItem>(`
      SELECT * FROM itens_venda
      WHERE venda_id = ?
      ORDER BY id ASC
    `, [vendaId]);
  }
};