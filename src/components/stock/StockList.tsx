import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react-native";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Product } from "../../types/products";

type ProductListProps = {
    search: string;
    onChangeSearch: (value: string) => void;
    products: Product[];
    onPressEditButton: (product: Product) => void;
    onPressAddStockButton: (product: Product) => void;
    onPressDeleteButton: (productId: number) => void;
};

export function StockList({
    search,
    onChangeSearch,
    products,
    onPressEditButton,
    onPressAddStockButton,
    onPressDeleteButton
}: ProductListProps) {

    //const [expandedProduct, setExpandedProduct] = useState(false);

    function getStockStatus(product: Product) {

        if (product.quantidade === 0) {
            return (
                <Text style={{color: "#A00"}}>Sem estoque</Text>
            );
        }

        if (product.quantidade <= product.estoque_minimo) {
            return (<Text style={{color: "#AA0"}}>Baixo estoque</Text>)
        }


        return (<Text>Em estoque</Text>);
    }

    return (
        <View style={styles.container}>

            <TextInput
                placeholder="Buscar produto..."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={search}
                onChangeText={onChangeSearch}
            />
            <View>
                {
                    products.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
                        </View>
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                        >
                            {
                                products.map((product) => (
                                    <View key={product.id} style={styles.productItem}>
                                        <View style={styles.header}>
                                            <Text style={styles.nameProduct}>{product.nome}</Text>
                                            <Text>{getStockStatus(product)}</Text>
                                        </View>
                                        <View style={styles.priceProduct}>
                                            <Text style={{ color: '#6B7280', fontSize: 16 }}>Preço</Text>
                                            <Text style={{ color: '#0B0', fontSize: 16 }}>R$: {product.preco.toFixed(2)}</Text>
                                        </View>

                                        <View style={styles.stockQuantity}>
                                            <Text style={{ color: '#6B7280', fontSize: 16 }}>Estoque</Text>
                                            <Text style={{ color: '#6B7280', fontSize: 16 }}>{product.quantidade} unidades</Text>
                                        </View>

                                        <View style={styles.stockQuantity}>
                                            <Text style={{ color: '#6B7280', fontSize: 16 }}>Estoque Mínimo</Text>
                                            <Text style={{ color: '#6B7280', fontSize: 16 }}>{product.estoque_minimo} unidades</Text>
                                        </View>

                                        <View style={styles.options}>
                                            <TouchableOpacity
                                                onPress={() => { onPressEditButton(product) }}
                                                style={{ flex: 2 }}
                                            >
                                                <View style={{ backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, padding: 10, borderRadius: 5, borderColor: "#AAA", borderWidth: 1 }}>
                                                    <Edit size={25} color="#000" />
                                                    <Text>Editar</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onPressAddStockButton(product) }}
                                                style={{ flex: 2 }}
                                            >
                                                <View style={{ backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, padding: 10, borderRadius: 5, borderColor: "#AAA", borderWidth: 1 }}>
                                                    <Plus size={25} color="#000" />
                                                    <Text>Adicionar</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { onPressDeleteButton(product.id) }}
                                                style={{ flex: 1 }}
                                            >
                                                <View style={{ backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, padding: 10, borderRadius: 5, borderColor: "#F00", borderWidth: 1 }}>
                                                    <Trash2 size={25} color="#F00" />
                                                    {/*<Text>Excluir</Text>*/}
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Detalhes expandidos do produto */}

                                        {//TODO: Implementar detalhes expandidos do produto
                                            <TouchableOpacity
                                            //onPress={() => setExpandedProduct(!expandedProduct)}
                                            >
                                                {/*<Text>{expandedProduct ? "Fechar detalhes" : "Ver detalhes"}</Text>*/}
                                            </TouchableOpacity>
                                        }

                                    </View>
                                ))
                            }
                        </ScrollView>
                    )}
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
    },
    listContent: {
        gap: 12,
        paddingBottom: 4,
    },
    productItem: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 16,
    },
    nameProduct: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },
    priceProduct: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },
    stockQuantity: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4
    },
    options: {
        flex: 1,
        flexDirection: "row",
        gap: 5,
    },
    emptyState: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 14,
    },
})