import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login';
import { AuthStackParamList } from '../types/navigation';
import { ROUTES } from '../constants/routes';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />
    </Stack.Navigator>
  );
}