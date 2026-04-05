import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { accountsService } from '../../services/accountsService';

type AccountListItem = {
    cliente_nome: string;
    telefone: string | null;
    id: number;
    cliente_id: number;
    saldo_devedor: number;
    status: 'aberta' | 'fechada';
};

export default function Contas() {
    const navigation = useNavigation<any>();

    const [accounts, setAccounts] = useState<AccountListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    function loadAccounts() {
        try {
            const data = accountsService.getAccountsList();
            setAccounts(data);
        } catch (error) {
            console.error('Erro ao carregar contas:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    function handleRefresh() {
        setRefreshing(true);
        loadAccounts();
    }

    function handleOpenAccount(accountId: number) {
        navigation.navigate('AccountDetails', {
            accountId,
        });
    }

    useFocusEffect(
        useCallback(() => {
            loadAccounts();
        }, [])
    );

    function renderStatus(status: 'aberta' | 'fechada') {
        return status === 'aberta' ? 'Aberta' : 'Fechada';
    }

    function renderItem({ item }: { item: AccountListItem }) {
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
            //onPress={() => handleOpenAccount(item.idconta)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.clientName}>{item.cliente_nome}</Text>
                    <Text style={styles.status}>{renderStatus(item.status)}</Text>
                </View>

                <Text style={styles.phone}>
                    {item.telefone ? item.telefone : 'Sem telefone'}
                </Text>

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Saldo devedor</Text>
                    <Text style={styles.balanceValue}>
                        R$ {Number(item.saldo_devedor).toFixed(2)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Carregando contas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contas</Text>

            <FlatList
                data={accounts}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={
                    accounts.length === 0 ? styles.emptyContainer : styles.listContent
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyTitle}>Nenhuma conta encontrada</Text>
                        <Text style={styles.emptyText}>
                            As contas criadas a partir de vendas no débito aparecerão aqui.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 24,
    },
    card: {
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    cardHeader: {
        marginBottom: 8,
    },
    clientName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
    },
    phone: {
        fontSize: 14,
        color: '#555',
        marginBottom: 16,
    },
    balanceContainer: {
        marginTop: 4,
    },
    balanceLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 22,
        fontWeight: '700',
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyBox: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});