import { db } from '../../database/db';
import { productsRepository } from '../../database/repositories/productsRepository';
import { clientsRepository } from '../../database/repositories/clientsRepository';
import { accountsRepository } from '../../database/repositories/accountsRepository';
import { salesRepository } from '../../database/repositories/salesRepository';
import { itemsSaleRepository } from '../../database/repositories/itemsSaleRepository';

import {
  CreateSaleInput,
  CreateSaleResult,
  CartItem,
} from '../../types/sales';
import { Product } from '../../types/products';

function normalizeCartItems(itens: CartItem[]): CartItem[] {
  return itens.map((item) => ({
    ...item,
    subtotal: Number((item.preco * item.quantidade).toFixed(2))
  }));
}

function calculateTotal(itens: CartItem[]) {
  return Number(
    itens.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
  );
}

function validateCartItem(item: CartItem) {
  if (!item.productId) {
    throw new Error('Produto inválido.');
  }

  if (item.quantidade <= 0) {
    throw new Error(`Quantidade inválida para o item "${item.nome}".`);
  }

  if (item.preco < 0) {
    throw new Error(`Preço inválido para o item "${item.nome}".`);
  }
}

function validateSaleInput(input: CreateSaleInput) {
  if (!input.itens || input.itens.length === 0) {
    throw new Error('Adicione pelo menos um produto à venda.');
  }

  if (input.tipo === 'vista' && !input.formaPagamento) {
    throw new Error('Selecione a forma de pagamento.');
  }

  if (input.tipo === 'conta' && !input.clienteId) {
    throw new Error('Selecione um cliente para a venda na conta.');
  }

  input.itens.forEach(validateCartItem);
}

export const salesService = {
  createSale(input: CreateSaleInput): CreateSaleResult {
    validateSaleInput(input);

    const normalizedItems = normalizeCartItems(input.itens);
    const total = calculateTotal(normalizedItems);

    if (total <= 0) {
      throw new Error('O valor total da venda deve ser maior que zero.');
    }

    const produtosDoCarrinhoMap = new Map<number, Product>();

    normalizedItems.forEach((item) => {
      const produto = productsRepository.getById(item.productId);

      if (!produto) {
        throw new Error(`Produto não encontrado: ${item.nome}`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new Error(
          `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.quantidade}`
        );
      }

      produtosDoCarrinhoMap.set(item.productId, produto);
    });

    let result: CreateSaleResult = {
      vendaId: 0,
      total,
      contaId: null
    };

    db.withTransactionSync(() => {
      let contaId: number | null = null;

      if (input.tipo === 'conta') {
        const cliente = clientsRepository.getById(input.clienteId!);

        if (!cliente) {
          throw new Error('Cliente não encontrado.');
        }

        const contaExistente = accountsRepository.getByClientId(cliente.id);

        if (contaExistente) {
          contaId = contaExistente.id;
        } else {
          contaId = accountsRepository.create(cliente.id);
        }
      }

      const vendaId = salesRepository.createSale({
        data: input.data,
        valorTotal: total,
        tipo: input.tipo,
        formaPagamento: input.formaPagamento ?? null,
        contaId
      });

      normalizedItems.forEach((item) => {
        itemsSaleRepository.createSaleItem(vendaId, item);

        const produto = produtosDoCarrinhoMap.get(item.productId);

        if (!produto) {
          throw new Error(`Produto não encontrado para atualização de estoque: ${item.nome}`);
        }

        const novaQuantidade = produto.quantidade - item.quantidade;

        productsRepository.updateStock(produto.id, novaQuantidade);
      });

      if (input.tipo === 'conta' && contaId) {
        const conta = accountsRepository.getById(contaId);

        if (!conta) {
          throw new Error('Conta não encontrada após criação.');
        }

        const novoSaldo = Number((Number(conta.saldo_devedor) + total).toFixed(2));
        accountsRepository.updateSaldo(conta.id, novoSaldo);
      }

      result = {
        vendaId,
        total,
        contaId
      };
    });

    return result;
  }
};