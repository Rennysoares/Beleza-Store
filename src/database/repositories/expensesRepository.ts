import { getAll, getFirst, run } from '../db';
import { Expense } from '../../types/expenses';

export const expensesRepository = {

  /**
    * Consulta todas as despesas cadastradas no banco de dados
    * @returns Vetor contendo todas as despesas cadastradas
    */
  getAll(): Expense[] {
    return getAll<Expense>(`
          SELECT * FROM despesas
        `);
  },

  /**
   * Registra uma nova despesa no banco de dados
   * @param expense dados da despesa excedo o identificador
   * @returns o identificador da despesa registrada
   */

  create(expense: Omit<Expense, 'id'>): number {
    const result = run(
      `
      INSERT INTO despesas (descricao, valor, data)
      VALUES (?, ?, ?)
      `,
      [
        expense.descricao ?? null,
        Number(expense.valor),
        expense.data,
      ]
    );

    return result.lastInsertRowId as number;
  },

};