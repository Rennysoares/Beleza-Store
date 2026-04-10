import { View, StyleSheet } from 'react-native';
import { SummaryCard } from './SummaryCard';

type Props = {
  summary: {
    totalSales: number;
    totalRevenue: number;
    totalExpenses: number;
    balance: number;
    openAccounts: number;
    lowStockProducts: number;
  };
};

export function SummarySection({ summary }: Props) {
  return (
    <View style={styles.container}>

      <SummaryCard
        title="Vendas"
        value={summary.totalSales}
      />

      <SummaryCard
        title="Receita"
        value={summary.totalRevenue}
        type="positive"
      />

      <SummaryCard
        title="Despesas"
        value={summary.totalExpenses}
        type="negative"
      />

      <SummaryCard
        title="Saldo"
        value={summary.balance}
        highlight
        type={summary.balance >= 0 ? 'positive' : 'negative'}
      />

      <SummaryCard
        title="Contas em aberto"
        value={summary.openAccounts}
      />

      <SummaryCard
        title="Estoque baixo"
        value={summary.lowStockProducts}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});