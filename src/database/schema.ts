import { exec } from './db';

export function initializeDatabase() {
  exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT
    );

    CREATE TABLE IF NOT EXISTS contas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL UNIQUE,
      saldo_devedor REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'aberta',
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 0,
      estoque_minimo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      valor_total REAL NOT NULL,
      tipo TEXT NOT NULL,
      forma_pagamento TEXT,
      conta_id INTEGER,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );

    CREATE TABLE IF NOT EXISTS itens_venda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (venda_id) REFERENCES vendas(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER NOT NULL,
      valor_pago REAL NOT NULL,
      data_pagamento TEXT NOT NULL,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );

    CREATE TABLE IF NOT EXISTS despesas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao TEXT,
      valor REAL NOT NULL,
      data TEXT NOT NULL
    );
  `);
}