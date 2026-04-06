import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { accountsService, StatementItem } from '../../services/accountsService';
import AppIconProfile from '../../components/ui/AppIconProfile';
import { StatementItemCard } from '../../components/accounts/StatementItemCard';
import { Eye, DollarSign } from 'lucide-react-native';

import { Account } from '../../types/accounts';
import { Client } from '../../types/clients';
import { Payment } from '../../types/payments';
import { RegisterPaymentScreen } from '../../components/accounts/RegisterPayment';

type AccountListItem = {
    cliente_nome: string;
    telefone: string | null;
    id: number;
    cliente_id: number;
    saldo_devedor: number;
    status: 'aberta' | 'fechada';
};

type AccountDetails = {
    account: Account;
    client: Client | null;
    payments: Payment[];
    statement: StatementItem[];
}

export default function Contas() {
    //const navigation = useNavigation<any>();

    const [accounts, setAccounts] = useState<AccountListItem[]>([]);
    const [detailsAccount, setDetailsAccount] = useState<AccountDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
    const [modalReceivingVisible, setModalReceivingVisible] = useState(false);

    const mockStatement: StatementItem[] = [
        {
            id: 1,
            type: 'sale',
            date: '2026-04-15',
            value: 18,
            description: 'Venda lançada na conta',
        },
        {
            id: 2,
            type: 'payment',
            date: '2026-04-14',
            value: 10,
            description: 'Pagamento realizado',
        },
        {
            id: 3,
            type: 'sale',
            date: '2026-04-12',
            value: 12,
            description: 'Venda lançada na conta',
        },
        {
            id: 4,
            type: 'sale',
            date: '2026-04-13',
            value: 18,
            description: 'Venda lançada na conta',
        },
        {
            id: 5,
            type: 'payment',
            date: '2026-04-12',
            value: 10,
            description: 'Pagamento realizado',
        },
        {
            id: 6,
            type: 'sale',
            date: '2026-04-11',
            value: 12,
            description: 'Venda lançada na conta',
        },
    ];

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
        try {
            const details = accountsService.getAccountDetails(accountId);
            if (details) {
                setDetailsAccount(details);
            } else {
                console.error('Detalhes da conta não encontrados para ID:', accountId);
            }
        } catch (error) {
            console.error('Erro ao abrir detalhes da conta:', error);
        }
        setModalDetailsVisible(true)
    }

    function handleReceivePayment(accountId: number) {
        try {
            const details = accountsService.getAccountDetails(accountId);
            if (details) {
                setDetailsAccount(details);
            } else {
                console.error('Detalhes da conta não encontrados para ID:', accountId);
            }
        } catch (error) {
            console.error('Erro ao abrir detalhes da conta:', error);
        }
        setModalReceivingVisible(true);
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
                    <AppIconProfile firstLetter={item.cliente_nome.charAt(0)} />
                    <View>
                        <Text style={styles.clientName}>{item.cliente_nome}</Text>
                        <Text style={styles.status}>{renderStatus(item.status)}</Text>
                    </View>
                </View>

                {/*
                <Text style={styles.phone}>
                    {item.telefone ? item.telefone : 'Sem telefone'}
                </Text>
                */}
                <View style={styles.balanceContainer}>
                    <View>
                        <Text style={styles.balanceLabel}>Saldo devedor</Text>
                        <Text style={styles.balanceValue}>
                            R$ {Number(item.saldo_devedor).toFixed(2)}
                        </Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity
                            onPress={() => { handleOpenAccount(item.id)}}
                        >
                            <View style={styles.detailsButton}>
                                <Eye color={'#555'} size={16} />
                                <Text>Detalhes</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { handleReceivePayment(item.id) }}
                        >
                            <View style={styles.receiveButton}>
                                <DollarSign color={'#fff'} size={16} />
                                <Text>Receber</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (loading) {
        return (
            <View style={styles.centeredLoading}>
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
            <Modal
                visible={modalDetailsVisible}
                animationType="fade"
                onRequestClose={() => setModalDetailsVisible(false)}
                transparent={true}
            >
                {/*<TouchableWithoutFeedback onPress={() => setModalDetailsVisible(false)}>*/}
                <View style={styles.centeredModal}>
                    {/*<TouchableWithoutFeedback onPress={() => { }}>*/}
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalhes da conta</Text>

                        <View style={styles.modalHeader}>
                            <AppIconProfile firstLetter={'F'} />
                            <View>
                                <Text style={styles.clientName}>{detailsAccount?.client?.nome || 'Nome do cliente não disponível'}</Text>
                                <Text style={styles.phone}>{detailsAccount?.client?.telefone || 'Telefone do cliente não disponível'}</Text>
                            </View>
                        </View>

                        <View style={styles.debitContainer}>
                            <Text style={styles.debitLabel}>Débito Total</Text>
                            <Text style={styles.debitValue}>R$ {detailsAccount?.account?.saldo_devedor.toFixed(2) || '0,00'}</Text>
                        </View>

                        {/*<Text>Status: Aberta</Text>*/}
                        <Text>Extrato da Conta</Text>

                        <FlatList
                            //data = {mockStatement}
                            data={detailsAccount?.statement || []}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => <StatementItemCard item={item} />}
                            contentContainerStyle={{ paddingBottom: 12 }}
                            style={{ maxHeight: 300 }}
                        />

                        <TouchableOpacity onPress={() => setModalDetailsVisible(false)}>
                            <Text style={{ color: 'blue', marginTop: 20, textAlign: 'center' }}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                    {/*</TouchableWithoutFeedback>*/}
                </View>
                {/*</TouchableWithoutFeedback>*/}
            </Modal>
            <Modal
                visible={modalReceivingVisible}
                animationType="fade"
                onRequestClose={() => setModalReceivingVisible(false)}
                transparent={true}
            >
                <View style={styles.centeredModal}>
                    <RegisterPaymentScreen 
                        accountId={detailsAccount?.account?.id}
                        setModalReceivingVisible={setModalReceivingVisible}
                        refreshAccounts={loadAccounts}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    centeredLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    centeredModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 20,
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
    detailsButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: '#555',
        padding: 5,
        flexDirection: 'row',
        gap: 5
    },
    receiveButton: {
        backgroundColor: '#00ff11',
        borderRadius: 8,
        borderColor: '#555',
        padding: 5,
        flexDirection: 'row',
        gap: 5
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        width: '98%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        paddingBottom: 12
    },
    debitContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fef2f2',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    debitLabel: {
        fontSize: 14,
        color: '#364153',
        fontWeight: '500'
    },
    debitValue: {
        fontSize: 18,
        color: '#e7000b',
        fontWeight: '700'
    }
});