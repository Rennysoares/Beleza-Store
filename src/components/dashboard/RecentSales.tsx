import { View, Text, StyleSheet, FlatList } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { SaleType } from "../../types/sales";
import { formatDateTime } from "../../utils/date";

export type Sale = {
  id: number;
  data: string;
  valor_total: number;
  tipo: SaleType;
};

type RecentSalesProps = {
  sales: Sale[];
};

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas vendas</Text>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={true}
        style={{ maxHeight: 300 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <ShoppingCart size={20} color="#2563EB" />
            </View>

            <View style={styles.info}>
              <Text style={styles.clientName}>{item.tipo}</Text>
              <Text style={styles.date}>{formatDateTime(item.data)}</Text>
            </View>

            <Text style={styles.total}>
              R$ {item.valor_total.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  total: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16A34A",
  },
});