import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Product } from '../../types/sales';

type ProductListProps = {
  search: string;
  onChangeSearch: (value: string) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
};

export function ProductList({
  search,
  onChangeSearch,
  products,
  onAddProduct,
}: ProductListProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar produto..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        value={search}
        onChangeText={onChangeSearch}
      />

      <View style={styles.listContainer}>
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {products.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.nome}</Text>
                  <Text style={styles.productDetails}>
                    R$ {product.preco.toFixed(2).replace('.', ',')} • Estoque:{' '}
                    {product.quantidade}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => onAddProduct(product)}
                >
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  listContainer: {
    maxHeight: 300,
  },
  listContent: {
    gap: 12,
    paddingBottom: 4,
  },
  productCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    paddingRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  productDetails: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});