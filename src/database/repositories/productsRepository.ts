import { getAll, getFirst, run } from '../db';
import { Product } from '../../types/products';

export const productsRepository = {
  /**
   * Consulta os produtos cadastrados no banco de dados
   * @returns Vetor contendo todos os produtos cadastrados
   */
  getAll(): Product[] {
    return getAll<Product>(`
      SELECT * FROM produtos
      ORDER BY nome ASC
    `);
  },

  /**
   * Consulta os dados de um produto a partir do seu identificador
   * @param id Identificador numérico do produto específico
   * @returns Dados do produto ou null caso não exista
   */
  getById(id: number): Product | null {
    return getFirst<Product>(`
      SELECT * FROM produtos
      WHERE id = ?
    `, [id]);
  },

  /**
   * Registra um novo produto no banco de dados
   * @param data Dados do produto exceto o identificador
   * @returns identificador do produto criado
   */
  create(data: Omit<Product, 'id'>): number {
    const result = run(`
      INSERT INTO produtos (nome, preco, quantidade, estoque_minimo)
      VALUES (?, ?, ?, ?)
    `, [data.nome, data.preco, data.quantidade, data.estoque_minimo]);

    return result.lastInsertRowId as number;
  },

  /**
   * Atualiza os dados de um produto no banco de dados
   * @param data Dados do produto a serem atualizados, incluindo o identificador
   */
  update(data: Product): void {
    run(`
      UPDATE produtos
      SET nome = ?, preco = ?, quantidade = ?, estoque_minimo = ?
      WHERE id = ?
    `, [data.nome, data.preco, data.quantidade, data.estoque_minimo, data.id]);
  },

  /**
   * Atualiza a quantidade disponível de um produto
   * @param productId identificador do produto a ser atualizado
   * @param newQuantity nova quantidade disponível no estoque do produto
   */
  updateStock(productId: number, newQuantity: number): void {
    if (newQuantity < 0) {
      throw new Error('Quantidade de estoque não pode ser negativa');
    }

    run(`
      UPDATE produtos
      SET quantidade = ?
      WHERE id = ?
    `, [newQuantity, productId]);
  },

  /**
   * Exclui um produto do banco de dados
   * @param id Identificador do produto a ser excluído
   */
  deleteById(id: number): void {
    run(`
      DELETE FROM produtos
      WHERE id = ?
    `, [id]);
  },

  addStock(productId: number, amountToAdd: number): void {
    const product = this.getById(productId);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (amountToAdd <= 0) {
      throw new Error('A quantidade adicionada deve ser maior que zero');
    }

    const newQuantity = product.quantidade + amountToAdd;

    run(`
    UPDATE produtos
    SET quantidade = ?
    WHERE id = ?
  `, [newQuantity, productId]);
  }
  /* Implementações futuras:
  searchByName(term: string): Product[];
  getLowStockProducts(): Product[];
  getOutOfStockProducts(): Product[];
  */
};