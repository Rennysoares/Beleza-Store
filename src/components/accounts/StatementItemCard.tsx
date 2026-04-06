import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type StatementItem = {
  id: number;
  type: 'sale' | 'payment';
  date: string;
  value: number;
  description: string;
};

type Props = {
  item: StatementItem;
};

function formatCurrency(value: number) {
  return `R$ ${Number(value).toFixed(2)}`;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('pt-BR');
}

function getTypeLabel(type: StatementItem['type']) {
  return type === 'sale' ? 'Venda' : 'Pagamento';
}

export function StatementItemCard({ item }: Props) {
  const isSale = item.type === 'sale';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.badge, isSale ? styles.saleBadge : styles.paymentBadge]}>
          <Text style={styles.badgeText}>{getTypeLabel(item.type)}</Text>
        </View>

        <Text style={styles.value}>
          {formatCurrency(item.value)}
        </Text>
      </View>

      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  saleBadge: {
    backgroundColor: '#e8e8e8',
  },
  paymentBadge: {
    backgroundColor: '#dff3e4',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
});