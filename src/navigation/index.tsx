import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AuthRoutes from './AuthRoutes';
import AppRoutes from './AppRoutes';
import { useAuth } from '../hooks/useAuth';

import LockScreen from '../screens/LockApp';

export default function Routes() {

  const {
    isAuthenticated,
    isLoading,
    isLocked
  } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {
        !isAuthenticated
          ? <AuthRoutes />
          : isLocked
            ? <LockScreen />
            : <AppRoutes />
      }
    </NavigationContainer>
  );
}