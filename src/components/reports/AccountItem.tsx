import { View, Text, StyleSheet } from 'react-native';

type Props = {
  clientName: string;
  balance: number;
  status: string;
};

export function AccountItem({ clientName, balance, status }: Props) {

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <View style={styles.container}>

      <View>
        <Text style={styles.name}>{clientName}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      <Text style={styles.balance}>
        {formatCurrency(balance)}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    color: '#777',
  },
  balance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});