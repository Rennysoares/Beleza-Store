// LockScreen.tsx

import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';

import { useAuth } from '../../hooks/useAuth';
import { validatePassword } from '../../services/authService';

export default function LockScreen() {

  const { unlock } = useAuth();

  const [password, setPassword] = useState('');

  async function handleUnlock() {

    const valid = await validatePassword(password);

    if (!valid) {
      Alert.alert('Erro', 'Senha incorreta');
      return;
    }

    unlock();
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      padding: 20
    }}>

      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
      }}>
        Aplicativo bloqueado 🔒
      </Text>

      <TextInput
        secureTextEntry
        placeholder='Digite sua senha'
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 15,
          marginBottom: 20
        }}
      />

      <TouchableOpacity
        onPress={handleUnlock}
        style={{
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center'
        }}
      >

        <Text style={{
          color: '#fff',
          fontWeight: 'bold'
        }}>
          Desbloquear
        </Text>

      </TouchableOpacity>

    </View>
  );
}