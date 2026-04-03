import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SaleType } from '../../types/sales';

type SaleTypeSelectorProps = {
  value: SaleType;
  onChange: (value: SaleType) => void;
};

export function SaleTypeSelector({
  value,
  onChange,
}: SaleTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.optionButton, value === 'vista' && styles.activeButton]}
        onPress={() => onChange('vista')}
      >
        <Text
          style={[styles.optionText, value === 'vista' && styles.activeText]}
        >
          À vista
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, value === 'conta' && styles.activeButton]}
        onPress={() => onChange('conta')}
      >
        <Text
          style={[styles.optionText, value === 'conta' && styles.activeText]}
        >
          Na conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#111827',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  activeText: {
    color: '#FFFFFF',
  },
});