import { View, Text, StyleSheet } from 'react-native';

type Props = {
  type: 'sale' | 'payment' | 'expense';
  description: string;
  value: number;
  date: string;
};

export function FinancialItem({ type, description, value, date }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function getColor() {
    if (value > 0) return '#16a34a';
    if (value < 0) return '#dc2626';
    return '#111';
  }

  function getLabel() {
    if (type === 'sale') return 'Venda';
    if (type === 'payment') return 'Pagamento';
    return 'Despesa';
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  return (
    <View style={styles.container}>
      
      <View>
        <Text style={styles.type}>{getLabel()}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>

      <Text style={[styles.value, { color: getColor() }]}>
        {formatCurrency(value)}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  type: {
    fontSize: 12,
    color: '#888',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});