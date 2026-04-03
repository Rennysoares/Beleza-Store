import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import AppLogo from '../../components/ui/AppLogo';

export default function Login() {
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password.trim()) {
      Alert.alert('Atenção', 'Digite a senha para entrar.');
      return;
    }

    setLoading(true);

    const success = await login(password);

    setLoading(false);

    if (!success) {
      Alert.alert('Senha incorreta', 'Verifique a senha e tente novamente.');
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <View style={{display: 'flex', alignItems: 'center', padding:10}}>
        <AppLogo/>
      </View>
      
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>
        Bem-vindo(a)
      </Text>

      <Text style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>
        Digite sua senha para acessar o sistema
      </Text>

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: '#111',
          padding: 16,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}