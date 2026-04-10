import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PeriodFilter as PeriodType } from '../../utils/reportDateUtils';

type Props = {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
};

const options: { label: string; value: PeriodType }[] = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7days' },
  { label: '30 dias', value: '30days' },
  { label: 'Mês', value: 'month' },
];

export function PeriodFilter({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((item) => {
        const isActive = item.value === value;

        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onChange(item.value)}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#2563eb',
  },
  text: {
    fontSize: 13,
    color: '#333',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});