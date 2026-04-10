import { View, Text, StyleSheet } from 'react-native';

type Props = {
  name: string;
  totalSold: number;
  stock: number;
};

export function ProductItem({ name, totalSold, stock }: Props) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.subtitle}>
          Vendidos: {totalSold}
        </Text>
      </View>

      <Text style={styles.stock}>
        Estoque: {stock}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  stock: {
    fontSize: 12,
    color: '#333',
  },
});