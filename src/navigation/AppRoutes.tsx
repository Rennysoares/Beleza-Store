import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/Dashboard';
import StockScreen from '../screens/Stock';
import NewSaleScreen from '../screens/NewSale';
import AccountsScreen from '../screens/Accounts';
import ReportsScreen from '../screens/Reports';
import NewExpenseScreen from '../screens/NewExpense';

import { AppStackParamList } from '../types/navigation';
import { ROUTES } from '../constants/routes';
import AppLogo from '../components/ui/AppLogo';

import { useAuth } from '../hooks/useAuth';

import {
  LayoutDashboard,
  Package,
  Plus,
  Receipt,
  BarChart3,
  Minus
} from 'lucide-react-native';

const Stack = createBottomTabNavigator<AppStackParamList>();

export default function AppRoutes() {

  const { logout } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.DASHBOARD}
      screenOptions={{
        headerTitle: () => <AppLogo />,
        headerTitleAlign: "left",
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: '#d11a2a',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 10 }}>
              Sair
            </Text>
          </TouchableOpacity>
        ),
        //headerRight: () =>{} <- Colocar um ícone de sistema de notificação

        //Personalização
        tabBarActiveTintColor: "rgb(155,23,250)",
        tabBarInactiveTintColor: "rgb(74,85,101)",
        /*tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },*/
      }}
    >
      <Stack.Screen
        name={ROUTES.DASHBOARD}
        component={DashboardScreen}
        options={{ title: 'Início', tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Stack.Screen
        name={ROUTES.STOCK}
        component={StockScreen}
        options={{ title: 'Estoque', tabBarIcon: ({ color, size }) => <Package color={color} size={size} /> }}
      />

      <Stack.Screen
        name={ROUTES.NEW_SALE}
        component={NewSaleScreen}
        options={{ title: 'Nova venda', tabBarIcon: ({ color, size }) => <Plus color={color} size={size} /> }}
      />

      <Stack.Screen
        name={ROUTES.ACCOUNTS}
        component={AccountsScreen}
        options={{ title: 'Contas', tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} /> }}
      />
      <Stack.Screen
        name={ROUTES.REPORTS}
        component={ReportsScreen}
        options={{ title: 'Relatórios', tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} /> }}
      />
      <Stack.Screen
        name={ROUTES.NEW_EXPENSE}
        component={NewExpenseScreen}
        options={{ title: 'Nova Despesa', tabBarIcon: ({ color, size }) => <Minus color={color} size={size} /> }}
      />
    </Stack.Navigator>
  );
}