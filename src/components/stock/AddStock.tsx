import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Product } from '../../types/products';
import { productsRepository } from '../../database/repositories/productsRepository';

type AddStockProps = {
  product: Product;
  setIsModalVisible: (visible: boolean) => void;
  onSuccess: () => void;
};

export function AddStock({
  product,
  setIsModalVisible,
  onSuccess,
}: AddStockProps) {
  const [loading, setLoading] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  function formatIntegerInput(text: string) {
    return text.replace(/[^0-9]/g, '');
  }

  function validateInput() {
    if (!amountToAdd.trim()) {
      Alert.alert('Atenção', 'Informe a quantidade que deseja adicionar');
      return false;
    }

    const amount = Number(amountToAdd);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Atenção', 'Informe uma quantidade válida maior que zero');
      return false;
    }

    return true;
  }

  async function handleAddStock() {
    if (!validateInput()) {
      return;
    }

    try {
      setLoading(true);

      const amount = Number(amountToAdd);

      productsRepository.addStock(product.id, amount);

      Alert.alert('Sucesso', 'Estoque atualizado com sucesso!');
      setIsModalVisible(false);
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao adicionar estoque:', error);

      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível atualizar o estoque.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Adicionar ao Estoque</Text>
        <Text style={styles.modalSubtitle}>
          Informe a quantidade que deseja adicionar
        </Text>

        <Text style={styles.label}>Produto</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{product.nome}</Text>
        </View>

        <Text style={styles.label}>Quantidade atual</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{product.quantidade}</Text>
        </View>

        <Text style={styles.label}>Quantidade a adicionar</Text>
        <TextInput
          value={amountToAdd}
          onChangeText={(text) => setAmountToAdd(formatIntegerInput(text))}
          placeholder="Ex: 10"
          style={styles.input}
          keyboardType="numeric"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddStock}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.buttonText}> Atualizando...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Adicionar ao Estoque</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsModalVisible(false)}
          style={styles.secondaryButton}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
    backgroundColor: '#f5f5f5',
  },
  infoText: {
    fontSize: 15,
    color: '#676767',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
});