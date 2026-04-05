import React, { useState, useCallback, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { RecentSales } from '../../components/dashboard/RecentSales';
import { salesRepository } from '../../database/repositories/salesRepository';

import { Sale } from '../../types/sales';
import { Client } from '../../types/clients';
import { Product } from '../../types/products';

export default function Dashboard() {

  //const [products, setProducts] = useState<Product[]>([]);
  //const [clients, setClients] = useState<Client[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadInitialData = useCallback(() => {
    try {
      setLoadingData(true);

      //const productsData = productsRepository.getAll();
      //const clientsData = clientsRepository.getAll();
      const salesData = salesRepository.getAllSales();

      //setProducts(productsData);
      //setClients(clientsData);
      setSales(salesData);

    } catch (error) {
      console.error('Erro ao carregar dados da venda:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da venda.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [loadInitialData])
  );

  if (loadingData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Carregando dados</Text>
        </View>
      );
    }
  return (
    <View style={styles.container}>
      <RecentSales sales={sales} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
  },
})