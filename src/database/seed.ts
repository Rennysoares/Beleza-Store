import { productsRepository } from './repositories/productsRepository';
import { clientsRepository } from './repositories/clientsRepository';

export function seedDatabase() {
  const produtos = productsRepository.getAll();

  if (produtos.length === 0) {
    productsRepository.create({
      nome: 'Perfume A',
      preco: 59.9,
      quantidade: 10,
      estoque_minimo: 2
    });

    productsRepository.create({
      nome: 'Hidratante B',
      preco: 24.9,
      quantidade: 15,
      estoque_minimo: 3
    });

    productsRepository.create({
      nome: 'Sabonete C',
      preco: 8.5,
      quantidade: 30,
      estoque_minimo: 5
    });
  }

  const clientes = clientsRepository.getAll();

  if (clientes.length === 0) {
    clientsRepository.create({
      nome: 'Maria Silva',
      telefone: '92999999999'
    });

    clientsRepository.create({
      nome: 'João Souza',
      telefone: '92988888888'
    });
  }
}