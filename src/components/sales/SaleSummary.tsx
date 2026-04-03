import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SaleSummaryProps = {
  totalItems: number;
  totalValue: number;
  onFinishSale: () => void;
  loading?: boolean;
};

export function SaleSummary({
  totalItems,
  totalValue,
  onFinishSale,
  loading = false,
}: SaleSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Itens</Text>
        <Text style={styles.value}>{totalItems}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.total}>
          R$ {totalValue.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.finishButton, loading && styles.disabledButton]}
        onPress={onFinishSale}
        disabled={loading}
      >
        <Text style={styles.finishButtonText}>
          {loading ? 'Finalizando...' : 'Finalizar Venda'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  total: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  finishButton: {
    marginTop: 8,
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});