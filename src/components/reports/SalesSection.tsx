import { View, Text, StyleSheet } from 'react-native';

type Props = {
  data: {
    total: number;
    quantity: number;
    sales: any[];
  };
};

export function SalesSection({ data }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Vendas</Text>

      <View style={styles.summary}>
        <Text>Total: {formatCurrency(data.total)}</Text>
        <Text>Quantidade: {data.quantity}</Text>
      </View>

      <View style={styles.list}>
        {data.sales.map((sale) => (
          <View key={sale.id} style={styles.item}>
            <Text>{new Date(sale.data).toLocaleDateString('pt-BR')}</Text>
            <Text>{formatCurrency(sale.valor_total)}</Text>
          </View>
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
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});