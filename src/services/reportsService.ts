// reportsService.ts

import { salesRepository } from '../database/repositories/salesRepository';
import { paymentsRepository } from '../database/repositories/paymentsRepository';
import { expensesRepository } from '../database/repositories/expensesRepository';
import { accountsRepository } from '../database/repositories/accountsRepository';
import { productsRepository } from '../database/repositories/productsRepository';
import { itemsSaleRepository } from '../database/repositories/itemsSaleRepository';

// -----------------------------
// TYPES
// -----------------------------

export type DateRange = {
  start: Date;
  end: Date;
};

export type SummaryReport = {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  balance: number;
  openAccounts: number;
  lowStockProducts: number;
};

export type FinancialStatementItem = {
  type: 'sale' | 'payment' | 'expense';
  id: number;
  date: string;
  value: number;
  description: string;
};

// -----------------------------
// UTILS
// -----------------------------

function isWithinRange(date: string | Date, range: DateRange) {
  const d = new Date(date);

  const start = new Date(range.start);
  const end = new Date(range.end);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return d >= start && d <= end;
}

function toNumber(value: any) {
  return Number(value) || 0;
}

// -----------------------------
// CORE FUNCTIONS
// -----------------------------

// 🟢 Total de vendas (todas, incluindo conta)
export function getTotalSales(range: DateRange): number {
  const sales = salesRepository.getAllSales() ?? [];

  return sales
    .filter((sale: any) => isWithinRange(sale.data, range))
    .reduce((acc: number, sale: any) => {
      return acc + toNumber(sale.valor_total);
    }, 0);
}

// 🟢 Receita real (DINHEIRO que entrou)
export function getTotalRevenue(range: DateRange): number {
  const sales = salesRepository.getAllSales() ?? [];
  const payments = paymentsRepository.getAll() ?? [];

  const cashSales = sales
    .filter((sale: any) =>
      sale.tipo === 'vista' &&
      isWithinRange(sale.data, range)
    )
    .reduce((acc: number, sale: any) => {
      return acc + toNumber(sale.valor_total);
    }, 0);

  const receivedPayments = payments
    .filter((payment: any) =>
      isWithinRange(payment.data_pagamento, range)
    )
    .reduce((acc: number, payment: any) => {
      return acc + toNumber(payment.valor_pago);
    }, 0);

  return cashSales + receivedPayments;
}

// 🔴 Despesas
export function getTotalExpenses(range: DateRange): number {
  const expenses = expensesRepository.getAll() ?? [];

  return expenses
    .filter((expense: any) =>
      isWithinRange(expense.data, range)
    )
    .reduce((acc: number, expense: any) => {
      return acc + toNumber(expense.valor);
    }, 0);
}

// 🟣 Saldo
export function getBalance(range: DateRange): number {
  const revenue = getTotalRevenue(range);
  const expenses = getTotalExpenses(range);

  return revenue - expenses;
}

// 🟡 Contas em aberto
export function getOpenAccounts(): number {
  const accounts = accountsRepository.getAll() ?? [];

  return accounts.filter(
    (acc: any) => acc.status === 'aberta'
  ).length;
}

// 🟠 Produtos com estoque baixo
export function getLowStockProducts(): number {
  const products = productsRepository.getAll() ?? [];

  return products.filter((p: any) => {
    if (p.estoque_minimo == null) return false;
    return p.quantidade <= p.estoque_minimo;
  }).length;
}

// -----------------------------
// SUMMARY REPORT
// -----------------------------

export function getSummaryReport(range: DateRange): SummaryReport {
  const totalSales = getTotalSales(range);
  const totalRevenue = getTotalRevenue(range);
  const totalExpenses = getTotalExpenses(range);
  const balance = getBalance(range);
  const openAccounts = getOpenAccounts();
  const lowStockProducts = getLowStockProducts();

  return {
    totalSales,
    totalRevenue,
    totalExpenses,
    balance,
    openAccounts,
    lowStockProducts,
  };
}

// -----------------------------
// SALES REPORT
// -----------------------------

export function getSalesReport(range: DateRange) {
  const sales = salesRepository.getAllSales() ?? [];

  const filtered = sales.filter((sale: any) =>
    isWithinRange(sale.data, range)
  );

  const total = filtered.reduce(
    (acc: number, sale: any) => acc + toNumber(sale.valor_total),
    0
  );

  return {
    total,
    quantity: filtered.length,
    sales: filtered,
  };
}

// -----------------------------
// FINANCIAL REPORT (EXTRATO)
// -----------------------------

export function getFinancialReport(range: DateRange) {
  const sales = salesRepository.getAllSales() ?? [];
  const payments = paymentsRepository.getAll() ?? [];
  const expenses = expensesRepository.getAll() ?? [];

  const statement: FinancialStatementItem[] = [];

  // vendas à vista
  sales.forEach((sale: any) => {
    if (
      sale.tipo === 'vista' &&
      isWithinRange(sale.data, range)
    ) {
      statement.push({
        type: 'sale',
        id: sale.id,
        date: sale.data,
        value: toNumber(sale.valor_total),
        description: 'Venda à vista',
      });
    }
  });

  // pagamentos recebidos
  payments.forEach((payment: any) => {
    if (isWithinRange(payment.data_pagamento, range)) {
      statement.push({
        type: 'payment',
        id: payment.id,
        date: payment.data_pagamento,
        value: toNumber(payment.valor_pago),
        description: 'Pagamento recebido',
      });
    }
  });

  // despesas
  expenses.forEach((expense: any) => {
    if (isWithinRange(expense.data, range)) {
      statement.push({
        type: 'expense',
        id: expense.id,
        date: expense.data,
        value: -toNumber(expense.valor),
        description: expense.descricao || 'Despesa',
      });
    }
  });

  // ordenar por data (mais recente primeiro)
  statement.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalRevenue = getTotalRevenue(range);
  const totalExpenses = getTotalExpenses(range);
  const balance = totalRevenue - totalExpenses;

  return {
    statement,
    totalRevenue,
    totalExpenses,
    balance,
  };
}

// -----------------------------
// PRODUCTS REPORT
// -----------------------------

export function getProductsReport() {
  const products = productsRepository.getAll() ?? [];
  const items = itemsSaleRepository.getAll() ?? [];

  const salesMap: Record<number, number> = {};

  items.forEach((item: any) => {
    const productId = item.id;
    const quantity = toNumber(item.quantidade);

    if (!salesMap[productId]) {
      salesMap[productId] = 0;
    }

    salesMap[productId] += quantity;
  });

  const result = products.map((product: any) => ({
    ...product,
    totalSold: salesMap[product.id] || 0,
  }));

  const mostSold = [...result].sort(
    (a, b) => b.totalSold - a.totalSold
  );

  const lowStock = result.filter(
    (p) =>
      p.estoque_minimo != null &&
      p.quantidade <= p.estoque_minimo
  );

  return {
    products: result,
    mostSold,
    lowStock,
  };
}

// -----------------------------
// ACCOUNTS REPORT
// -----------------------------

export function getAccountsReport() {
  const accounts = accountsRepository.getAll() ?? [];
  const payments = paymentsRepository.getAll() ?? [];

  const openAccounts = accounts.filter(
    (acc: any) => acc.status === 'aberta'
  );

  const totalOpenBalance = openAccounts.reduce(
    (acc: number, accItem: any) =>
      acc + toNumber(accItem.saldo_devedor),
    0
  );

  return {
    openAccounts,
    totalOpenBalance,
    payments,
  };

}

export function getSalesByDay(range: DateRange) {
  const sales = salesRepository.getAllSales();

  const filtered = sales.filter((sale) =>
    isWithinRange(sale.data, range)
  );

  const grouped: Record<string, number> = {};

  filtered.forEach((sale) => {
    const date = sale.data.split('T')[0]; // YYYY-MM-DD

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += Number(sale.valor_total);
  });

  return Object.entries(grouped)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}