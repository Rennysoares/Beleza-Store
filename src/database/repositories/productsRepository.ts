import { getAll, getFirst, run } from '../db';
import { Product } from '../../types/sales';

export const productsRepository = {
  getAll(): Product[] {
    return getAll<Product>(`
      SELECT * FROM produtos
      ORDER BY nome ASC
    `);
  },

  getById(id: number): Product | null {
    return getFirst<Product>(`
      SELECT * FROM produtos
      WHERE id = ?
    `, [id]);
  },

  create(data: Omit<Product, 'id'>): number {
    const result = run(`
      INSERT INTO produtos (nome, preco, quantidade, estoque_minimo)
      VALUES (?, ?, ?, ?)
    `, [data.nome, data.preco, data.quantidade, data.estoque_minimo]);

    return result.lastInsertRowId as number;
  },

  updateStock(productId: number, newQuantity: number): void {
    run(`
      UPDATE produtos
      SET quantidade = ?
      WHERE id = ?
    `, [newQuantity, productId]);
  }
};