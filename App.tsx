

import Routes from "./src/navigation";
import { AuthProvider } from './src/contexts/AuthContext';

import { useEffect, useRef } from 'react';
import { initializeDatabase } from './src/database/schema';
//import { seedDatabase } from './src/database/seed';

import { salesRepository } from './src/database/repositories/salesRepository';
import { accountsRepository } from './src/database/repositories/accountsRepository';
import { productsRepository } from './src/database/repositories/productsRepository';


export default function App() {

  //const products = await productRepository.getAll();
  //console.log('Produtos:', products);

  console.log('Vendas:', salesRepository.getAllSales());
  console.log('Contas:', accountsRepository.getAll());
  console.log('Produtos:', productsRepository.getAll());

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