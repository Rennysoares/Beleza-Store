import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CartItem } from '../../types/sales';

type CartListProps = {
  cart: CartItem[];
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onRemoveItem: (productId: number) => void;
};

export function CartList({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}: CartListProps) {
  if (cart.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Nenhum item no carrinho.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {cart.map((item) => (
          <View key={item.productId} style={styles.cartItem}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.price}>
                R$ {item.preco.toFixed(2).replace('.', ',')}
              </Text>
            </View>

            <View style={styles.actions}>
              <View style={styles.topRow}>
                <View style={styles.quantityBox}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => onDecreaseQuantity(item.productId)}
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.quantidade}</Text>

                  <TouchableOpacity
                    style={styles.qtyButton}
                    onPress={() => onIncreaseQuantity(item.productId)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => onRemoveItem(item.productId)}>
                  <Text style={styles.removeText}>Remover</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtotal}>
                Subtotal: R$ {item.subtotal.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    maxHeight: 300,
  },
  listContent: {
    gap: 12,
    paddingBottom: 4,
  },
  cartItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  info: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  price: {
    fontSize: 14,
    color: '#6B7280',
  },
  actions: {
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qtyButton: {
    backgroundColor: '#E5E7EB',
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  removeText: {
    color: '#DC2626',
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