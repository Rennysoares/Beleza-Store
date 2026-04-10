import { View, Text, StyleSheet } from 'react-native';
import { AccountItem } from './AccountItem';

type Props = {
  data: {
    openAccounts: any[];
    totalOpenBalance: number;
  };
};

export function AccountsSection({ data }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Contas</Text>

      {/* 💰 TOTAL EM ABERTO */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total em aberto: {formatCurrency(data.totalOpenBalance)}
        </Text>
      </View>

      {/* 👥 LISTA DE CLIENTES */}
      <View style={styles.card}>
        {data.openAccounts.length === 0 ? (
          <Text style={styles.empty}>
            Nenhuma conta em aberto
          </Text>
        ) : (
          data.openAccounts.map((account) => (
            <AccountItem
              key={account.id}
              clientName={`Cliente #${account.id}`}
              balance={account.saldo_devedor}
              status={account.status}
            />
          ))
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summary: {
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  empty: {
    padding: 10,
    color: '#777',
    fontSize: 12,
  },
});