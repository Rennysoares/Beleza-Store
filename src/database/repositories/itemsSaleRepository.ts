import { getAll, getFirst, run } from '../db';
import { CartItem, PaymentMethod, Sale, SaleItem, SaleType } from '../../types/sales';

import { ItemSale } from '../../types/itemSales';
export const itemsSaleRepository = {

  /**
    * Consulta os itens de venda cadastrados no banco de dados
    * @returns Vetor contendo todos os itens de venda cadastrados
    */
  getAll(): ItemSale[] {
    return getAll<ItemSale>(`
          SELECT * FROM itens_venda
    `);
  },

  /**
   * Registra no banco de dados os itens do carrinho criado na venda 
   * @param vendaId identificador da referente venda
   * @param item itens do carrinho
   */
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

  /**
   * Retorna todos os itens comprados de uma venda específica registrada no sistema
   * @param vendaId Identificador da venda registrada
   * @returns Vetor contendo todos os itens comprados da venda
   */
  getSaleItems(vendaId: number): SaleItem[] {
    return getAll<SaleItem>(`
      SELECT * FROM itens_venda
      WHERE venda_id = ?
      ORDER BY id ASC
    `, [vendaId]);
  },

  /**
   * Verificar se foi feita alguma venda de um determinado produto
   * @param productId Identificador do produto cadastrado
   * @returns Booleano que diz se foi feito ou não
   */
  hasSales(productId: number): boolean {
    const result = getFirst<{ total: number }>(`
    SELECT COUNT(*) as total
    FROM itens_venda
    WHERE produto_id = ?
  `, [productId]);

    return (result?.total ?? 0) > 0;
  }
};