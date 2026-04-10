import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  value: number;
  highlight?: boolean;
  type?: 'positive' | 'negative' | 'neutral';
};

export function SummaryCard({ title, value, highlight, type = 'neutral' }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function getColor() {
    if (type === 'positive') return '#16a34a'; // verde
    if (type === 'negative') return '#dc2626'; // vermelho
    return '#111';
  }

  return (
    <View style={[styles.card, highlight && styles.highlight]}>
      <Text style={styles.title}>{title}</Text>

      <Text style={[styles.value, { color: getColor() }]}>
        {formatCurrency(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,

    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,

    // Android
    elevation: 2,
  },
  highlight: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  title: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});