import { getAll, getFirst, run } from '../db';
import { Account } from '../../types/sales';

export const accountsRepository = {
  getAll(): Account[] {
    return getAll<Account>(`
      SELECT * FROM contas
      ORDER BY id DESC
    `);
  },

  getByClientId(clienteId: number): Account | null {
    return getFirst<Account>(`
      SELECT * FROM contas
      WHERE cliente_id = ?
    `, [clienteId]);
  },

  getById(id: number): Account | null {
    return getFirst<Account>(`
      SELECT * FROM contas
      WHERE id = ?
    `, [id]);
  },

  create(clienteId: number): number {
    const result = run(`
      INSERT INTO contas (cliente_id, saldo_devedor, status)
      VALUES (?, 0, 'aberta')
    `, [clienteId]);

    return result.lastInsertRowId as number;
  },

  updateSaldo(contaId: number, novoSaldo: number): void {
    run(`
      UPDATE contas
      SET saldo_devedor = ?,
          status = CASE WHEN ? <= 0 THEN 'fechada' ELSE 'aberta' END
      WHERE id = ?
    `, [novoSaldo, novoSaldo, contaId]);
  }
};