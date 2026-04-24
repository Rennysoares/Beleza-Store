import { getFirst, getAll } from '../database/db';

export function loadDashboardData() {

    const hoje = new Date().toISOString().split('T')[0];

    // 💰 Entradas (vendas do dia)
    const entradas = getFirst<{ total: number }>(
        `SELECT SUM(valor_total) as total 
   FROM vendas 
   WHERE substr(data, 1, 10) = ?`,
        [hoje]
    );

    // 💸 Saídas (despesas do dia)
    const saidas = getFirst<{ total: number }>(
        `SELECT SUM(valor) as total 
   FROM despesas 
   WHERE substr(data, 1, 10) = ?`,
        [hoje]
    );

    // 📊 Vendas do dia (quantidade)
    const vendas = getFirst<{ total: number; quantidade: number }>(
        `SELECT 
    COUNT(*) as quantidade,
    SUM(valor_total) as total
   FROM vendas 
   WHERE substr(data, 1, 10) = ?`,
        [hoje]
    );

    // 📦 Estoque baixo
    const estoqueBaixo = getAll<{
        id: number;
        nome: string;
        quantidade: number;
    }>(
        `SELECT id, nome, quantidade 
     FROM produtos 
     WHERE estoque_minimo IS NOT NULL 
     AND quantidade <= estoque_minimo`
    );

    // 🧾 Contas pendentes
    const contas = getFirst<{ total: number; quantidade: number }>(
        `SELECT 
      COUNT(*) as quantidade,
      SUM(saldo_devedor) as total
     FROM contas 
     WHERE status = 'aberta'`
    );

    const mesAtual = new Date().toISOString().slice(0, 7);

    const vendasMes = getFirst<{ total: number }>(
        `SELECT SUM(valor_total) as total 
   FROM vendas 
   WHERE substr(data, 1, 7) = ?`,
        [mesAtual]
    );

    const despesasMes = getFirst<{ total: number }>(
        `SELECT SUM(valor) as total 
   FROM despesas 
   WHERE substr(data, 1, 7) = ?`,
        [mesAtual]
    );

    const totalVendasMes = vendasMes?.total ?? 0;
    const totalDespesasMes = despesasMes?.total ?? 0;
    const lucroMes = totalVendasMes - totalDespesasMes;

    const entradasValor = entradas?.total ?? 0;
    const saidasValor = saidas?.total ?? 0;


    return {
        saldoHoje: entradasValor - saidasValor,
        entradasHoje: entradasValor,
        saidasHoje: saidasValor,

        lucroMes: lucroMes,

        vendasHoje: {
            total: vendas?.quantidade ?? 0,
            valor: vendas?.total ?? 0
        },

        estoqueBaixo,

        contasPendentes: {
            total: contas?.quantidade ?? 0,
            valor: contas?.total ?? 0
        }
    };
}