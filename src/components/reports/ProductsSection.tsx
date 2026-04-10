import { View, Text, StyleSheet } from 'react-native';
import { ProductItem } from './ProductItem';

type Props = {
  data: {
    mostSold: any[];
    lowStock: any[];
  };
};

export function ProductsSection({ data }: Props) {

  const topProducts = data.mostSold.slice(0, 5);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Produtos</Text>

      {/* 🏆 MAIS VENDIDOS */}
      <Text style={styles.sectionTitle}>Mais vendidos</Text>

      <View style={styles.card}>
        {topProducts.length === 0 ? (
          <Text style={styles.empty}>Nenhuma venda registrada</Text>
        ) : (
          topProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              name={`${index + 1}. ${product.nome}`}
              totalSold={product.totalSold}
              stock={product.quantidade}
            />
          ))
        )}
      </View>

      {/* ⚠️ ESTOQUE BAIXO */}
      <Text style={styles.sectionTitle}>Estoque baixo</Text>

      <View style={styles.card}>
        {data.lowStock.length === 0 ? (
          <Text style={styles.empty}>Nenhum produto com estoque baixo</Text>
        ) : (
          data.lowStock.map((product) => (
            <ProductItem
              key={product.id}
              name={product.nome}
              totalSold={product.totalSold}
              stock={product.quantidade}
            />
          ))
        )}
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  empty: {
    padding: 10,
    color: '#777',
    fontSize: 12,
  },
});