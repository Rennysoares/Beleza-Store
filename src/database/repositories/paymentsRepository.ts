import { getAll, getFirst, run } from '../db';
import { Payment } from '../../types/payments';
export const paymentsRepository = {

  getAll(): Payment[] {
    return getAll<Payment>(`
        SELECT * FROM pagamentos
        ORDER BY data_pagamento DESC
      `);
  },

  getByAccountId(accountId: number): Payment[] {
    return getAll<Payment>(`
        SELECT * FROM pagamentos
        WHERE conta_id = ?
        ORDER BY data_pagamento DESC
      `, [accountId]);
  },

  create(data: Omit<Payment, 'id'>): number {
    const result = run(`
        INSERT INTO pagamentos (conta_id, valor_pago, data_pagamento)
        VALUES (?, ?, ?)
      `, [data.conta_id, data.valor_pago, data.data_pagamento]);

    return result.lastInsertRowId as number;
  },

  delete(id: number): void {
    run(`
        DELETE FROM pagamentos
        WHERE id = ?
      `, [id]);
  }

}