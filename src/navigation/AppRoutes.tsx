import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/Dashboard';
import EstoqueScreen from '../screens/Estoque';
import NovaVendaScreen from '../screens/NovaVenda';
import ContasScreen from '../screens/Contas';
import RelatoriosScreen from '../screens/Relatorios';

import { AppStackParamList } from '../types/navigation';
import { ROUTES } from '../constants/routes';
import AppLogo from '../components/ui/AppLogo';

import {
  LayoutDashboard, 
  Package,
  Plus,
  Receipt, 
  BarChart3
} from 'lucide-react-native';

const Stack = createBottomTabNavigator<AppStackParamList>();

export default function AppRoutes() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.DASHBOARD}
      screenOptions={{
        headerTitle: () => <AppLogo />,
        headerTitleAlign: "left",
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
        name={ROUTES.ESTOQUE}
        component={EstoqueScreen}
        options={{ title: 'Estoque', tabBarIcon: ({ color, size }) => <Package color={color} size={size} />}}
      />

        <Stack.Screen
        name={ROUTES.NOVA_VENDA}
        component={NovaVendaScreen}
        options={{ title: 'Nova venda', tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />}}
      />
      
      <Stack.Screen
        name={ROUTES.CONTAS}
        component={ContasScreen}
        options={{ title: 'Contas', tabBarIcon: ({ color, size }) => <Receipt color={color} size={size} />}}
      />
      <Stack.Screen
        name={ROUTES.RELATORIOS}
        component={RelatoriosScreen}
        options={{ title: 'Relatórios', tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />}}
      />
    </Stack.Navigator>
  );
}