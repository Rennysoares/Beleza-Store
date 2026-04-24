import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { loadDashboardData } from '../../services/dashboardService';
import { ROUTES } from '../../constants/routes';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../types/navigation';

export default function Dashboard() {

  type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

  const navigation = useNavigation<NavigationProps>();

  const [data, setData] = useState<any>(null);
  useFocusEffect(
    useCallback(() => {
      const result = loadDashboardData();
      setData(result);
    }, [])
  );

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2)}`;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* 👋 Header */}
        <Text style={styles.header}>Olá 👋</Text>
        <Text style={styles.subHeader}>Resumo de hoje</Text>

        {/* 💰 SALDO (DESTAQUE PRINCIPAL) */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo de hoje</Text>
          <Text style={styles.balanceValue}>
            {formatCurrency(data.saldoHoje)}
          </Text>
        </View>

        {/* 📊 Entradas / Saídas */}
        <View style={styles.row}>
          <View style={[styles.smallCard, styles.greenCard]}>
            <Text style={styles.cardLabel}>Entradas</Text>
            <Text style={styles.cardValue}>
              {formatCurrency(data.entradasHoje)}
            </Text>
          </View>

          <View style={[styles.smallCard, styles.redCard]}>
            <Text style={styles.cardLabel}>Saídas</Text>
            <Text style={styles.cardValue}>
              {formatCurrency(data.saidasHoje)}
            </Text>
          </View>
        </View>

        {/* 💵 Lucro do mês */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Lucro do mês</Text>
          <Text style={styles.highlightValue}>
            {formatCurrency(data.lucroMes)}
          </Text>
        </View>

        {/* 📦 Estoque baixo */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>⚠️ Estoque baixo</Text>

          {data.estoqueBaixo.length === 0 ? (
            <Text style={styles.emptyText}>Tudo ok por aqui 👌</Text>
          ) : (
            data.estoqueBaixo.map((item: any) => (
              <View key={item.id} style={styles.listItem}>
                <Text>{item.nome}</Text>
                <Text style={styles.badge}>{item.quantidade}</Text>
              </View>
            ))
          )}
        </View>

        {/* 🧾 Contas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contas pendentes</Text>

          <Text style={styles.text}>
            {data.contasPendentes.total} contas abertas
          </Text>

          <Text style={styles.highlightValue}>
            {formatCurrency(data.contasPendentes.valor)}
          </Text>
        </View>

        {/* ⚡ Ações rápidas */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionButton, styles.greenBtn]}
            onPress={() => { navigation.navigate(ROUTES.NEW_SALE) }}
          >
            <Text style={styles.actionText}>+ Venda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.grayBtn]}
            onPress={() => { navigation.navigate(ROUTES.NEW_EXPENSE) }}
          >
            <Text style={styles.actionText}>+ Despesa</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f7'
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold'
  },

  subHeader: {
    color: '#777',
    marginBottom: 20
  },

  balanceCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20
  },

  balanceLabel: {
    color: '#aaa',
    marginBottom: 5
  },

  balanceValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold'
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15
  },

  smallCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15
  },

  greenCard: {
    backgroundColor: '#e8f5e9'
  },

  redCard: {
    backgroundColor: '#ffebee'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 15
  },

  cardLabel: {
    color: '#666',
    fontSize: 13
  },

  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5
  },

  highlightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },

  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },

  text: {
    fontSize: 14
  },

  emptyText: {
    color: '#888'
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },

  badge: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 8
  },

  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },

  greenBtn: {
    backgroundColor: '#4CAF50'
  },

  grayBtn: {
    backgroundColor: '#555'
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});