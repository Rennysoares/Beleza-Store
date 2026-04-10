import { clientsRepository } from '../database/repositories/clientsRepository';
import { accountsRepository } from '../database/repositories/accountsRepository';
import { paymentsRepository } from '../database/repositories/paymentsRepository';
// opcional agora, mas importante para o extrato:
import { salesRepository } from '../database/repositories/salesRepository';
import { Client } from '../types/clients';
import { Account } from '../types/accounts';

import { getCurrentDateTime } from '../utils/date';

export type StatementItem = {
  type: 'sale' | 'payment';
  id: number;
  date: string;
  value: number;
  description: string;
};

type FindOrCreateClientInput = {
  nome: string;
  telefone?: string;
};

type RegisterPaymentInput = {
  accountId: number;
  value: number;
  paymentDate?: string;
};

type AddSaleToAccountInput = {
  clientId: number;
  saleValue: number;
};

/* =========================
   HELPERS
========================= */

function getTodayDate(): string {
  return getCurrentDateTime();
}

function normalizeName(name: string): string {
  return name.trim();
}

/* =========================
   SERVICE
========================= */

export const accountsService = {
  /* =========================
     1) CLIENTE
  ========================= */

  findOrCreateClient({
    nome,
    telefone,
  }: FindOrCreateClientInput): Client {
    const normalizedName = normalizeName(nome);

    if (!normalizedName) {
      throw new Error('O nome do cliente é obrigatório.');
    }

    const existingClient = clientsRepository.getByName(normalizedName);

    if (existingClient) {
      return existingClient;
    }

    const createdClientId = clientsRepository.create({
      nome: normalizedName,
      telefone: telefone ?? null,
    });

    const createdClient = clientsRepository.getById(createdClientId);

    if (!createdClient) {
      throw new Error('Erro ao buscar cliente recém-criado.');
    }

    return createdClient;
  },

  /* =========================
     2) CONTA
  ========================= */

  findOrCreateOpenAccount(clientId: number): Account {
    if (!clientId) {
      throw new Error('ID do cliente é obrigatório.');
    }

    const existingAccount =
      accountsRepository.getOpenByClientId(clientId);

    if (existingAccount) {
      return existingAccount;
    }

    const createdAccountId = accountsRepository.create(clientId);

    const createdAccount = accountsRepository.getById(createdAccountId);

    if (!createdAccount) {
      throw new Error('Erro ao buscar conta recém-criada.');
    }

    return createdAccount;
  },

  /* =========================
     3) ADICIONAR VENDA À CONTA
  ========================= */

  addSaleToAccount({
    clientId,
    saleValue,
  }: AddSaleToAccountInput): Account{
    if (!clientId) {
      throw new Error('ID do cliente é obrigatório.');
    }

    if (saleValue <= 0) {
      throw new Error('O valor da venda deve ser maior que zero.');
    }

    const account = this.findOrCreateOpenAccount(clientId);

    const newBalance = Number(account.saldo_devedor) + Number(saleValue);

    accountsRepository.updateSaldo(account.id!, newBalance);

    const updatedAccount = accountsRepository.getById(account.id!);

    if (!updatedAccount) {
      throw new Error('Erro ao atualizar saldo da conta.');
    }

    return updatedAccount;
  },

  /* =========================
     4) REGISTRAR PAGAMENTO
  ========================= */

  registerPayment({
    accountId,
    value,
    paymentDate,
  }: RegisterPaymentInput): Account {
    if (!accountId) {
      throw new Error('ID da conta é obrigatório.');
    }

    if (value <= 0) {
      throw new Error('O valor do pagamento deve ser maior que zero.');
    }

    const account = accountsRepository.getById(accountId);

    if (!account) {
      throw new Error('Conta não encontrada.');
    }

    if (account.status === 'fechada') {
      throw new Error('Essa conta já está fechada.');
    }

    if (value > Number(account.saldo_devedor)) {
      throw new Error('O pagamento não pode ser maior que o saldo devedor.');
    }

    paymentsRepository.create({
      conta_id: accountId,
      valor_pago: value,
      data_pagamento: paymentDate ?? getTodayDate(),
    });

    const newBalance = Number(account.saldo_devedor) - Number(value);

    accountsRepository.updateSaldo(accountId, newBalance);

    if (newBalance === 0) {
      accountsRepository.updateStatus(accountId, 'fechada');
    }

    const updatedAccount = accountsRepository.getById(accountId);

    if (!updatedAccount) {
      throw new Error('Erro ao atualizar conta após pagamento.');
    }

    return updatedAccount;
  },

  /* =========================
     5) EXTRATO DA CONTA
  ========================= */

  getAccountStatement(accountId: number): StatementItem[] {
    if (!accountId) {
      throw new Error('ID da conta é obrigatório.');
    }

    const sales = salesRepository.getByAccountId(accountId) ?? [];
    const payments = paymentsRepository.getByAccountId(accountId) ?? [];
    
    const formattedSales: StatementItem[] = sales.map((sale: any) => ({
      type: 'sale',
      id: sale.id,
      date: sale.data,
      value: Number(sale.valor_total),
      description: 'Venda lançada na conta',
    }));

    const formattedPayments: StatementItem[] = payments.map((payment: any) => ({
      type: 'payment',
      id: payment.id,
      date: payment.data_pagamento,
      value: Number(payment.valor_pago),
      description: 'Pagamento realizado',
    }));

    const statement = [...formattedSales, ...formattedPayments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return statement;
  },

  /* =========================
     6) DETALHES COMPLETOS DA CONTA
     (útil para tela de detalhes)
  ========================= */

  getAccountDetails(accountId: number) {
    if (!accountId) {
      throw new Error('ID da conta é obrigatório.');
    }

    const account = accountsRepository.getById(accountId);

    if (!account) {
      throw new Error('Conta não encontrada.');
    }

    const client = clientsRepository.getById(account.cliente_id);
    const payments = paymentsRepository.getByAccountId(accountId);
    const statement = this.getAccountStatement(accountId);

    return {
      account,
      client,
      payments,
      statement,
    };
  },

  getAccountsList() {
  const accounts = accountsRepository.getAll();

  const accountsWithClients = (
    accounts.map((account) => {
      const client = clientsRepository.getById(account.id);

      return {
        ...account,
        cliente_nome: client?.nome ?? 'Cliente não encontrado',
        telefone: client?.telefone ?? null,
      };
    })
  );

  return accountsWithClients;
}
};