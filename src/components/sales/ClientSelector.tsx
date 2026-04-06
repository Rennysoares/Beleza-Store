import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Client } from '../../types/clients';

type CreateClientInput = {
  nome: string;
  telefone?: string | null;
};

type ClientSelectorProps = {
  search: string;
  onChangeSearch: (value: string) => void;
  clients: Client[];
  selectedClientId: number | null;
  onSelectClient: (clientId: number) => void;
  onCreateClient: (data: CreateClientInput) => number | Client;
};

export function ClientSelector({
  search,
  onChangeSearch,
  clients,
  selectedClientId,
  onSelectClient,
  onCreateClient,
}: ClientSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  function resetCreateForm() {
    setNewClientName('');
    setNewClientPhone('');
    setShowCreateForm(false);
  }

  function handleCreateClient() {
    const nome = newClientName.trim();
    const telefone = newClientPhone.trim();

    if (!nome) {
      Alert.alert('Atenção', 'Informe o nome do cliente.');
      return;
    }

    try {
      const created = onCreateClient({
        nome,
        telefone: telefone || null,
      });

      const createdClientId =
        typeof created === 'number' ? created : created.id;

      if (!createdClientId) {
        throw new Error('Cliente criado sem ID válido.');
      }

      onSelectClient(createdClientId);
      onChangeSearch('');
      resetCreateForm();

      Alert.alert('Sucesso', 'Cliente cadastrado com sucesso.');
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      Alert.alert(
        'Erro',
        error?.message || 'Não foi possível cadastrar o cliente.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar cliente..."
        placeholderTextColor="#9CA3AF"
        style={styles.searchInput}
        value={search}
        onChangeText={onChangeSearch}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowCreateForm((prev) => !prev)}
      >
        <Text style={styles.addButtonText}>
          {showCreateForm ? 'Cancelar novo cliente' : '+ Novo cliente'}
        </Text>
      </TouchableOpacity>

      {showCreateForm && (
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>Cadastrar novo cliente</Text>

          <TextInput
            placeholder="Nome do cliente"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={newClientName}
            onChangeText={setNewClientName}
          />

          <TextInput
            placeholder="Telefone (opcional)"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={newClientPhone}
            onChangeText={setNewClientPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateClient}
          >
            <Text style={styles.createButtonText}>Salvar cliente</Text>
          </TouchableOpacity>
        </View>
      )}

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
  addButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  addButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  createCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  createTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  createButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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