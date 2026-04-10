import { View, Text, StyleSheet } from 'react-native';
import { FinancialItem } from './FinancialItem';

type Props = {
  data: {
    statement: any[];
    totalRevenue: number;
    totalExpenses: number;
    balance: number;
  };
};

export function FinancialSection({ data }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Extrato Financeiro</Text>

      <View style={styles.summary}>
        <Text>Entradas: {formatCurrency(data.totalRevenue)}</Text>
        <Text>Saídas: {formatCurrency(data.totalExpenses)}</Text>
        <Text style={{ fontWeight: 'bold' }}>
          Saldo: {formatCurrency(data.balance)}
        </Text>
      </View>

      <View style={styles.list}>
        {data.statement.map((item) => (
          <FinancialItem
            key={`${item.type}-${item.id}`}
            type={item.type}
            description={item.description}
            value={item.value}
            date={item.date}
          />
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    marginBottom: 10,
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
});