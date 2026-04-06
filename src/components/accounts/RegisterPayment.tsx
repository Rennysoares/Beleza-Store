import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';

import { accountsService } from '../../services/accountsService';


export function RegisterPaymentScreen({ accountId, setModalReceivingVisible, refreshAccounts }: { accountId: number | undefined, setModalReceivingVisible: (visible: boolean) => void, refreshAccounts: () => void }) {


    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    function formatInputValue(text: string) {
        // permite apenas números e vírgula/ponto
        return text.replace(',', '.').replace(/[^0-9.]/g, '');
    }

    function handleRegisterPayment() {
        const parsedValue = Number(value);

        if (!value.trim()) {
            Alert.alert('Atenção', 'Informe o valor do pagamento.');
            return;
        }

        if (isNaN(parsedValue) || parsedValue <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido maior que zero.');
            return;
        }

        try {
            setLoading(true);
            console.log('Registrando pagamento para conta ID:', accountId, 'com valor:', parsedValue);
            if (accountId === undefined) {
                throw new Error('ID da conta é obrigatório para registrar o pagamento. Informe ao desenvolvedor a falha.');
            }

            accountsService.registerPayment({
                accountId,
                value: parsedValue,
            });
            
            Alert.alert('Sucesso', 'Pagamento registrado com sucesso.', [
                {
                    text: 'OK',
                    onPress: () => {
                        setModalReceivingVisible(false);
                    },
                },
            ]);

            refreshAccounts();

        } catch (error: any) {
            console.error('Erro ao registrar pagamento:', error);

            Alert.alert(
                'Erro',
                error?.message || 'Não foi possível registrar o pagamento.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                //style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Registrar pagamento</Text>
                    <Text style={styles.subtitle}>
                        Informe o valor pago para esta conta.
                    </Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>Valor do pagamento</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Ex: 25.00"
                            keyboardType="decimal-pad"
                            value={value}
                            onChangeText={(text) => setValue(formatInputValue(text))}
                            editable={!loading}
                        />

                        <Text style={styles.helperText}>
                            Digite apenas o valor que foi pago.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={() => {handleRegisterPayment()}}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Confirmar pagamento</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => {setModalReceivingVisible(false)}}
                        disabled={loading}
                    >
                        <Text style={styles.secondaryButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        width: '98%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#f7f7f7',
        borderRadius: 14,
        padding: 16,
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    helperText: {
        marginTop: 10,
        fontSize: 13,
        color: '#666',
    },
    button: {
        backgroundColor: '#111',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
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
});