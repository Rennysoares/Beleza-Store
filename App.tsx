

import Routes from "./src/navigation";
import { AuthProvider } from './src/contexts/AuthContext';

import { useEffect, useRef } from 'react';
import { initializeDatabase } from './src/database/schema';
//import { seedDatabase } from './src/database/seed';

import { salesRepository } from './src/database/repositories/salesRepository';
import { accountsRepository } from './src/database/repositories/accountsRepository';
import { productsRepository } from './src/database/repositories/productsRepository';
import { clientsRepository } from "./src/database/repositories/clientsRepository";
import { paymentsRepository } from "./src/database/repositories/paymentsRepository";
import { expensesRepository } from "./src/database/repositories/expensesRepository";
import { itemsSaleRepository } from "./src/database/repositories/itemsSaleRepository";

import { run } from "./src/database/db";

export default function App() {


  
/*
  const resetDatabase = () => {
    run('PRAGMA foreign_keys = OFF');

    run('DELETE FROM itens_venda');
    run('DELETE FROM vendas');
    run('DELETE FROM pagamentos');
    run('DELETE FROM contas');
    run('DELETE FROM clientes');
    run('DELETE FROM produtos');
    run('DELETE FROM despesas');

    run('DELETE FROM sqlite_sequence');

    run('PRAGMA foreign_keys = ON');
  };

  try{
    resetDatabase()
    console.log('Banco de dados resetado com sucesso!')
  } catch (error) {
    console.error('Erro ao resetar: ', error)
  }
  */

  //console.log('Vendas:', salesRepository.getAllSales());
  //console.log('Contas:', accountsRepository.getAll());
  //console.log('Clientes:', clientsRepository.getAll());
  //console.log('Produtos:', productsRepository.getAll());
  //console.log('Pagamentos: ', paymentsRepository.getAll());
  //console.log('Despesas: ', expensesRepository.getAll());
  //console.log('Itens vendidos: ', itemsSaleRepository.getAll());


  /*
  const id = expensesRepository.create({
    descricao: 'Compra de embalagens',
    valor: 120,
    data: '2026-04-10T13:06:19.921Z',
  });

  console.log('Despesa criada com ID:', id);
  */

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    initializedRef.current = true;

    try {
      initializeDatabase();
      //seedDatabase();
      console.log('Banco inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
    }
  }, []);

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}