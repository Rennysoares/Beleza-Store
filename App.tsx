

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


export default function App() {

  //const products = await productRepository.getAll();
  //console.log('Produtos:', products);

  //console.log('Vendas:', salesRepository.getAllSales());
  //console.log('Contas:', accountsRepository.getAll());
  console.log('Clientes:', clientsRepository.getAll());
  //console.log('Produtos:', productsRepository.getAll());
  //console.log('Pagamentos: ', paymentsRepository.getAll());

  //console.log('Cliente:', clientsRepository.getByName('Eduardo'));
  //console.log('Conta aberta:', accountsRepository.getOpenByClientId(1));
  //accountsRepository.updateStatus(1, 'aberta');
  const initializedRef = useRef(false);

  /*
  paymentsRepository.create({
    conta_id: 2,
    valor_pago: 100,
    data_pagamento: new Date().toISOString()
  });
  */

  //paymentsRepository.delete(1);
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