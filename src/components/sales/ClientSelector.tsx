import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Client } from '../../types/sales';

type ClientSelectorProps = {
  search: string;
  onChangeSearch: (value: string) => void;
  clients: Client[];
  selectedClientId: number | null;
  onSelectClient: (clientId: number) => void;
};

export function ClientSelector({
  search,
  onChangeSearch,
  clients,
  selectedClientId,
  onSelectClient,
}: ClientSelectorProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar cliente..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        value={search}
        onChangeText={onChangeSearch}
      />

      {clients.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
        </View>
      ) : (
        clients.map((client) => {
          const isSelected = selectedClientId === client.id;

          return (
            <TouchableOpacity
              key={client.id}
              style={[styles.clientCard, isSelected && styles.selectedCard]}
              onPress={() => onSelectClient(client.id)}
            >
              <Text
                style={[styles.clientName, isSelected && styles.selectedText]}
              >
                {client.nome}
              </Text>
              <Text
                style={[styles.clientPhone, isSelected && styles.selectedText]}
              >
                {client.telefone || 'Sem telefone'}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  clientCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
  },
  selectedCard: {
    backgroundColor: '#111827',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clientPhone: {
    marginTop: 4,
    fontSize: 14,
    color: '#6B7280',
  },
  selectedText: {
    color: '#FFFFFF',
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
});