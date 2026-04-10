import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { ProductList } from '../../components/sales/ProductList';
import { CartList } from '../../components/sales/CartList';
import { SaleTypeSelector } from '../../components/sales/SaleTypeSelector';
import { PaymentSelector } from '../../components/sales/PaymentSelector';
import { ClientSelector } from '../../components/sales/ClientSelector';
import { SaleSummary } from '../../components/sales/SaleSummary';

import {
  CartItem,
  SaleType,
  PaymentMethod,
} from '../../types/sales';
import { Product } from '../../types/products';
import { Client } from '../../types/clients';

import { productsRepository } from '../../database/repositories/productsRepository';
import { clientsRepository } from '../../database/repositories/clientsRepository';
import { salesService } from '../../services/salesService';

import AppPlusButton from '../../components/ui/AppPlusButton';

export default function NewSale() {
  const [productSearch, setProductSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [saleType, setSaleType] = useState<SaleType>('vista');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>('pix');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const loadInitialData = useCallback(() => {
    try {
      setLoadingData(true);

      const productsData = productsRepository.getAll();
      const clientsData = clientsRepository.getAll();

      setProducts(productsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Erro ao carregar dados da venda:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da venda.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.nome.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.nome.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantidade, 0);
  }, [cart]);

  const totalValue = useMemo(() => {
    return Number(
      cart.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
    );
  }, [cart]);

  function getAvailableStock(productId: number) {
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;

    const quantityInCart = cart.find((item) => item.productId === productId)?.quantidade ?? 0;

    return product.quantidade - quantityInCart;
  }

  function handleAddProduct(product: Product) {
    const availableStock = getAvailableStock(product.id);

    if (availableStock <= 0) {
      Alert.alert(
        'Estoque insuficiente',
        `Não há mais unidades disponíveis de "${product.nome}".`
      );
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.productId === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
              ...item,
              quantidade: item.quantidade + 1,
              subtotal: Number(((item.quantidade + 1) * item.preco).toFixed(2)),
            }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          nome: product.nome,
          preco: product.preco,
          quantidade: 1,
          subtotal: Number(product.preco.toFixed(2)),
        },
      ];
    });
  }

  function handleIncreaseQuantity(productId: number) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    const availableStock = getAvailableStock(productId);

    if (availableStock <= 0) {
      Alert.alert(
        'Estoque insuficiente',
        `Você já atingiu o limite disponível de "${product.nome}".`
      );
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
            ...item,
            quantidade: item.quantidade + 1,
            subtotal: Number(((item.quantidade + 1) * item.preco).toFixed(2)),
          }
          : item
      )
    );
  }

  function handleDecreaseQuantity(productId: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? {
              ...item,
              quantidade: item.quantidade - 1,
              subtotal: Number(((item.quantidade - 1) * item.preco).toFixed(2)),
            }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function handleRemoveItem(productId: number) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function handleChangeSaleType(value: SaleType) {
    setSaleType(value);

    if (value === 'vista') {
      setSelectedClientId(null);

      if (!paymentMethod) {
        setPaymentMethod('pix');
      }
    }

    if (value === 'conta') {
      setPaymentMethod(null);
    }
  }

  function handleCreateClient(data: { nome: string; telefone?: string | null }) {
    const newClientId = clientsRepository.create({
      nome: data.nome,
      telefone: data.telefone ?? null,
    });

    const updatedClients = clientsRepository.getAll();
    setClients(updatedClients);

    setSelectedClientId(newClientId);

    return newClientId;
  }

  function validateSale() {
    if (cart.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione pelo menos um produto à venda.');
      return false;
    }

    if (saleType === 'vista' && !paymentMethod) {
      Alert.alert('Pagamento obrigatório', 'Selecione a forma de pagamento.');
      return false;
    }

    if (saleType === 'conta' && !selectedClientId) {
      Alert.alert('Cliente obrigatório', 'Selecione um cliente para continuar.');
      return false;
    }

    return true;
  }

  function resetForm() {
    setCart([]);
    setSaleType('vista');
    setPaymentMethod('pix');
    setSelectedClientId(null);
    setProductSearch('');
    setClientSearch('');
  }

  function handleFinishSale() {
    if (!validateSale()) return;

    try {
      setLoading(true);

      const result = salesService.createSale({
        data: new Date().toISOString(),
        tipo: saleType,
        formaPagamento: saleType === 'vista' ? paymentMethod : null,
        clienteId: saleType === 'conta' ? selectedClientId : null,
        itens: cart,
      });

      Alert.alert(
        'Venda finalizada',
        saleType === 'conta'
          ? `Venda #${result.vendaId} criada com sucesso.\nConta #${result.contaId} aberta/atualizada.`
          : `Venda #${result.vendaId} criada com sucesso.`
      );

      resetForm();
      loadInitialData();
    } catch (error: any) {
      console.error('Erro ao finalizar venda:', error);

      Alert.alert(
        'Erro ao finalizar venda',
        error?.message || 'Não foi possível concluir a venda.'
      );
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

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
              <Text style={styles.title}>Nova Venda</Text>
              <Text style={styles.subtitle}>
                Adicione produtos e finalize a venda
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Produtos</Text>
              <ProductList
                search={productSearch}
                onChangeSearch={setProductSearch}
                products={filteredProducts}
                onAddProduct={handleAddProduct}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Carrinho</Text>
              <CartList
                cart={cart}
                onIncreaseQuantity={handleIncreaseQuantity}
                onDecreaseQuantity={handleDecreaseQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo da Venda</Text>
              <SaleTypeSelector
                value={saleType}
                onChange={handleChangeSaleType}
              />
            </View>

            {saleType === 'vista' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
                <PaymentSelector
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </View>
            )}

            {saleType === 'conta' && (
              <View style={styles.section}>

                <View style={styles.sectionview}>
                  <Text style={styles.sectionTitle}>Cliente</Text>
                </View>

                <ClientSelector
                  search={clientSearch}
                  onChangeSearch={setClientSearch}
                  clients={filteredClients}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  onCreateClient={handleCreateClient}
                />
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={styles.footer}>
            <SaleSummary
              totalItems={totalItems}
              totalValue={totalValue}
              onFinishSale={handleFinishSale}
              loading={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 20,
  },
  header: {
    marginBottom: 8,
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
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
  sectionview: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});