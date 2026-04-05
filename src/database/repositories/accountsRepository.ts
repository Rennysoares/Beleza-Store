import { getAll, getFirst, run } from '../db';
import { Account } from '../../types/accounts';

export const accountsRepository = {
  
  /**
   * Obtém todas as contas cadastradas no banco de dados,
   * ordenando de forma decrescente do Id
   * @returns Vetor contendo as contas existentes
   */
  getAll(): Account[] {
    return getAll<Account>(`
      SELECT * FROM contas
      ORDER BY id DESC
    `);
  },

  /**
   * Procura a conta vinculada a partir de um cliente específico
   * @param clienteId Identificador numérico do cliente associado a conta 
   * @returns A conta encontrada ou null se não existir
   */
  getByClientId(clienteId: number): Account | null {
    return getFirst<Account>(`
      SELECT * FROM contas
      WHERE cliente_id = ?
    `, [clienteId]);
  },
  
  /**
   * Procura a conta a partir do seu identificador
   * @param id Identificador numérico da conta
   * @returns A conta encontrada ou null se não existir
   */
  getById(id: number): Account | null {
    return getFirst<Account>(`
      SELECT * FROM contas
      WHERE id = ?
    `, [id]);
  },

  getOpenByClientId(clienteId: number): Account | null {
    return getFirst<Account>(`
      SELECT * FROM contas
      WHERE cliente_id = ? AND status = 'aberta'
    `, [clienteId]);
  },

  /**
   * Cria uma nova conta no banco de dados
   * @param clienteId Identificador numérico do cliente criado
   * @returns Id da conta criada
   */
  create(clienteId: number): number {
    const result = run(`
      INSERT INTO contas (cliente_id, saldo_devedor, status)
      VALUES (?, 0, 'aberta')
    `, [clienteId]);

    return result.lastInsertRowId as number;
  },

  /**
   * Atualiza o saldo de uma conta específica
   * @param contaId Identificador numérico da conta a ser atualizada
   * @param novoSaldo Valor do novo saldo a ser atualizada
   */
  updateSaldo(contaId: number, novoSaldo: number): void {
    run(`
      UPDATE contas
      SET saldo_devedor = ?,
          status = CASE WHEN ? <= 0 THEN 'fechada' ELSE 'aberta' END
      WHERE id = ?
    `, [novoSaldo, novoSaldo, contaId]);
  },

  updateStatus(contaId: number, status: 'aberta' | 'fechada'): void {
    run(`
      UPDATE contas
      SET status = ?
      WHERE id = ?
    `, [status, contaId]);
  }
};