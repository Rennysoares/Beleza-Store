import { getAll, getFirst, run } from '../db';
import { Client } from '../../types/sales';

export const clientsRepository = {
  getAll(): Client[] {
    return getAll<Client>(`
      SELECT * FROM clientes
      ORDER BY nome ASC
    `);
  },

  getById(id: number): Client | null {
    return getFirst<Client>(`
      SELECT * FROM clientes
      WHERE id = ?
    `, [id]);
  },

  create(data: Omit<Client, 'id'>): number {
    const result = run(`
      INSERT INTO clientes (nome, telefone)
      VALUES (?, ?)
    `, [data.nome, data.telefone ?? null]);

    return result.lastInsertRowId as number;
  }
};