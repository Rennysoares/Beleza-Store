import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import { productsRepository } from '../../database/repositories/productsRepository';
import { Product } from '../../types/products';

type ProductFormProps = {
    mode: 'create' | 'edit';
    setIsModalVisible: (visible: boolean) => void;
    onSuccess: () => void;
    initialData?: Product;
};

export function FormProduct({ mode, setIsModalVisible, initialData, onSuccess, }: ProductFormProps) {

    const isEditMode = mode === 'edit';

    const [loading, setLoading] = useState(false);

    const [productName, setProductName] = useState(initialData?.nome ?? '');
    const [productPrice, setProductPrice] = useState(
        initialData ? String(initialData.preco) : ''
    );
    const [productQuantity, setProductQuantity] = useState(
        initialData ? String(initialData.quantidade) : ''
    );
    const [productMinStock, setProductMinStock] = useState(
        initialData ? String(initialData.estoque_minimo) : ''
    );

    function formatDecimalValue(text: string) {
        let cleaned = text.replace(',', '.').replace(/[^0-9.]/g, '');

        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        return cleaned;
    }

    function formatIntegerInput(text: string) {
        return text.replace(/[^0-9]/g, '');
    }

    function resetForm() {
        setProductName('');
        setProductPrice('');
        setProductQuantity('');
        setProductMinStock('');
    }

    function validateInputs() {
        if (!productName.trim()) {
            Alert.alert('Atenção', 'Informe o nome do produto');
            return false;
        }

        if (!productPrice.trim()) {
            Alert.alert('Atenção', 'Informe o valor do produto');
            return false;
        }
        if (isNaN(Number(productPrice)) || Number(productPrice) <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido para o produto');
            return false;
        }

        if (!productQuantity.trim()) {
            Alert.alert('Atenção', 'Informe a quantidade do produto');
            return false;
        }
        if (isNaN(Number(productQuantity)) || Number(productQuantity) < 0) {
            Alert.alert('Atenção', 'Informe uma quantidade válida para o produto');
            return false;
        }

        if (!productMinStock.trim()) {
            Alert.alert('Atenção', 'Informe o estoque mínimo do produto');
            return false;
        }
        if (isNaN(Number(productMinStock)) || Number(productMinStock) < 0) {
            Alert.alert('Atenção', 'Informe um estoque mínimo válido para o produto');
            return false;
        }
        return true;
    }

    async function handleAddProduct() {

        if (!validateInputs()) {
            return;
        }

        try {
            setLoading(true);

            const payload = {
                nome: productName.trim(),
                preco: Number(productPrice),
                quantidade: Number(productQuantity),
                estoque_minimo: Number(productMinStock),
            };
            if (isEditMode && initialData) {
                productsRepository.update({
                    id: initialData.id,
                    ...payload,
                });

                Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
            } else {
                productsRepository.create(payload);
                Alert.alert('Sucesso', 'Produto adicionado com sucesso!');
                resetForm();
            }

            resetForm();
            setIsModalVisible(false);
            onSuccess();
        } catch (error: any) {
            console.error('Erro ao adicionar produto:', error);

            Alert.alert(
                'Erro',
                error?.message || 'Não foi possível adicionar o produto.'
            );
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        if (initialData) {
            setProductName(initialData.nome);
            setProductPrice(String(initialData.preco));
            setProductQuantity(String(initialData.quantidade));
            setProductMinStock(String(initialData.estoque_minimo));
        } else {
            resetForm();
        }
    }, [initialData]);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{isEditMode ? 'Editar Produto' : 'Novo Produto'}</Text>
                <Text style={styles.modalSubtitle}>
                    {isEditMode
                        ? 'Atualize os dados do produto'
                        : 'Preencha os dados do produto para adicionar ao estoque'}
                </Text>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    value={productName}
                    onChangeText={setProductName}
                    placeholder="Ex: Shampoo XYZ Avon"
                    style={styles.input}
                    editable={!loading}
                />
                <Text style={styles.label}>Preço</Text>
                <TextInput
                    value={productPrice}
                    onChangeText={(text) => setProductPrice(formatDecimalValue(text))}
                    editable={!loading}
                    placeholder="Ex: 19,90"
                    style={styles.input}
                    keyboardType="numeric"
                />
                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                    value={productQuantity}
                    onChangeText={(text) => setProductQuantity(formatIntegerInput(text))}
                    placeholder="Ex: 10"
                    style={styles.input}
                    keyboardType="numeric"
                    editable={!loading}
                />
                <Text style={styles.label}>Estoque mínimo</Text>
                <TextInput
                    value={productMinStock}
                    onChangeText={(text) => setProductMinStock(formatIntegerInput(text))}
                    placeholder="Ex: 5"
                    style={styles.input}
                    keyboardType="numeric"
                    editable={!loading}
                />
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={async () => { await handleAddProduct() }}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <View style={styles.loadingContent}>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.buttonText}> Salvando...</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>{isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}</Text>
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
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        //width: '98%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});