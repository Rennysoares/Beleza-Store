import { getAll, getFirst, run } from '../db';
import { Client } from '../../types/clients';

export const clientsRepository = {

  /**
   * Retorna todos os clientes cadastrados no banco de dados
   * @returns Vetor incluindo todos os clientes
   */
  getAll(): Client[] {
    return getAll<Client>(`
      SELECT * FROM clientes
      ORDER BY nome ASC
    `);
  },

  /**
   * Obtém o cadastro do cliente a partir do seu identificador
   * @param id Identificador numérico associado ao cliente
   * @returns Cliente encontrado ou null caso não exista
   */
  getById(id: number): Client | null {
    return getFirst<Client>(`
      SELECT * FROM clientes
      WHERE id = ?
    `, [id]);
  },

  /**
   * Cria um novo cliente no banco de dados
   * @param data Dados do cliente a ser cadastrado, exceto o identificador
   * @returns Identificador do cliente cadastrado
   */
  create(data: Omit<Client, 'id'>): number {
    const result = run(`
      INSERT INTO clientes (nome, telefone)
      VALUES (?, ?)
    `, [data.nome, data.telefone ?? null]);

    return result.lastInsertRowId as number;
  },

  getByName(name: string): Client | null {
    return getFirst<Client>(`
      SELECT * FROM clientes
      WHERE nome = ?
    `, [name]);
  },

};