import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Package } from 'lucide-react-native';
import AppLogo from '../../components/ui/AppLogo';
export default function Dashboard() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Dashboard
      </Text>

      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#d11a2a',
          padding: 14,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}