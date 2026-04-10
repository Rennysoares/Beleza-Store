import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type Props = {
  data: {
    date: string;
    total: number;
  }[];
};

export function SalesChart({ data }: Props) {

  if (data.length === 0) {
    return (
      <Text style={styles.empty}>
        Nenhuma venda no período
      </Text>
    );
  }

  const labels = data.map((item) =>
    new Date(item.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  );

  const values = data.map((item) => item.total);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendas por dia</Text>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="R$ "
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',

          decimalPlaces: 0,

          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,

          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#2563eb',
          },
        }}
        style={styles.chart}
      />
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
  chart: {
    borderRadius: 12,
  },
  empty: {
    marginTop: 20,
    color: '#777',
    fontSize: 12,
  },
});