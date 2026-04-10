import React, {
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { Product } from '../../types/products';
import { productsRepository } from '../../database/repositories/productsRepository';
import { StockList } from '../../components/stock/StockList';
import { FormProduct } from '../../components/stock/FormProduct';
import { salesRepository } from '../../database/repositories/salesRepository';
import { itemsSaleRepository } from '../../database/repositories/itemsSaleRepository';
import { AddStock } from '../../components/stock/AddStock';
export default function Stock() {

  const [productSearch, setProductSearch] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadInitialData = useCallback(() => {
    try {
      setLoadingData(true);
      const productsData = productsRepository.getAll();
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao carregar dados da venda:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da venda.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.nome.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  function handleOpenEdit(product: Product) {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  }

  function alertForDelete(productId: number) {
    Alert.alert(
      'Excluir produto',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleDelete(productId),
        },
      ]
    );
  }

  function handleOpenAddStock(product: Product) {
    setSelectedProduct(product);
    setIsAddStockModalVisible(true);
  }

  function handleDelete(productId: number) {
    try {
      const hasSales = itemsSaleRepository.hasSales(productId)
      if (hasSales) {
        Alert.alert('Erro', 'O produto não pode ser excluído pois foi feita alguma venda e precisa manter registro');
        return
      }
      productsRepository.deleteById(productId);
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
      loadInitialData();
    } catch (error: any) {
      console.error('Erro: ', error)
      Alert.alert('Erro', error?.message || 'Não foi possível excluir o produto.');
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.loadingText}>Carregando dados da venda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Produtos</Text>
              <Text style={styles.subtitle}>Gerencie seu catálogo de produtos</Text>
              <TouchableOpacity
                onPress={() => { setIsAddModalVisible(true) }}
                style={{ marginTop: 16, alignSelf: "flex-start", }}
              >
                <View style={styles.addButton}>
                  <Plus size={24} color='#FFF' />
                  <Text style={{ color: '#FFF' }}>Novo produto</Text>
                </View>
              </TouchableOpacity>
            </View>
            <StockList
              search={productSearch}
              onChangeSearch={setProductSearch}
              products={filteredProducts}
              onPressEditButton={handleOpenEdit}
              onPressAddStockButton={handleOpenAddStock}
              onPressDeleteButton={alertForDelete}
            />
          </ScrollView>
        </View>
        <Modal
          visible={isAddModalVisible}
          animationType="fade"
          onRequestClose={() => setIsAddModalVisible(false)}
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              style={styles.centeredModal}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <FormProduct mode='create' setIsModalVisible={setIsAddModalVisible} onSuccess={loadInitialData} />
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback >
        </Modal>
        <Modal visible={isEditModalVisible} transparent animationType="fade">
          <KeyboardAvoidingView
            style={styles.centeredModal}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {selectedProduct && (
              <FormProduct
                mode="edit"
                setIsModalVisible={setIsEditModalVisible}
                onSuccess={loadInitialData}
                initialData={selectedProduct}
              />
            )}
          </KeyboardAvoidingView>
        </Modal>
        <Modal visible={isAddStockModalVisible} transparent animationType="fade">
          <KeyboardAvoidingView
            style={styles.centeredModal}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {selectedProduct && (
              <AddStock
                product={selectedProduct}
                setIsModalVisible={setIsAddStockModalVisible}
                onSuccess={loadInitialData}
              />
            )}
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    flex: 1
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#6B7280',
  },
  scrollContent: {
    //padding: 16,
  },
  addButton: {
    backgroundColor: '#9810fa',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 20
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
  centeredModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },

});