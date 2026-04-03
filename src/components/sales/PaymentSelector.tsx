import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PaymentMethod } from '../../types/sales';

type PaymentSelectorProps = {
  value: PaymentMethod | null;
  onChange: (value: PaymentMethod) => void;
};

const paymentOptions: PaymentMethod[] = ['pix', 'dinheiro', 'cartao'];

const paymentLabels: Record<PaymentMethod, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
};

export function PaymentSelector({
  value,
  onChange,
}: PaymentSelectorProps) {
  return (
    <View style={styles.container}>
      {paymentOptions.map((payment) => {
        const isActive = value === payment;

        return (
          <TouchableOpacity
            key={payment}
            style={[styles.paymentButton, isActive && styles.activeButton]}
            onPress={() => onChange(payment)}
          >
            <Text style={[styles.paymentText, isActive && styles.activeText]}>
              {paymentLabels[payment]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  paymentButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  activeButton: {
    backgroundColor: '#111827',
  },
  paymentText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  activeText: {
    color: '#FFFFFF',
  },
});