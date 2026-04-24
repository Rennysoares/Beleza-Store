import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';

import { run } from '../../database/db';
import { useNavigation } from '@react-navigation/native';

export default function NovaDespesa() {
  const navigation = useNavigation();

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');

  const handleSalvar = () => {
    if (!valor) {
      Alert.alert('Erro', 'Informe o valor da despesa');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorNumerico)) {
      Alert.alert('Erro', 'Valor inválido');
      return;
    }

    const data = new Date().toISOString();

    try {
      run(
        `INSERT INTO despesas (descricao, valor, data) VALUES (?, ?, ?)`,
        [descricao, valorNumerico, data]
      );

      Alert.alert('Sucesso', 'Despesa registrada!');

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar');
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Nova Despesa</Text>

      {/* 📝 Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Conta de luz"
        value={descricao}
        onChangeText={setDescricao}
      />

      {/* 💰 Valor */}
      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 50.00"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      {/* 💾 Botão */}
      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f4f7'
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },

  label: {
    marginBottom: 5,
    color: '#555'
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15
  },

  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});