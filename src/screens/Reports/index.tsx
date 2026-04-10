import React, {
  useState,
  useCallback,
  useEffect,
  useMemo
} from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Header } from '../../components/reports/Header';
import { PeriodFilter } from '../../components/reports/PeriodFilter';
import { SummarySection } from '../../components/reports/SummarySection';
import { SalesSection } from '../../components/reports/SalesSection';
import { FinancialSection } from '../../components/reports/FinancialSection';
import { ProductsSection } from '../../components/reports/ProductsSection';
import { AccountsSection } from '../../components/reports/AccountsSection';

import { SalesChart } from '../../components/reports/SalesChart';
import {
  getSummaryReport, 
  getFinancialReport, 
  getSalesReport, 
  getProductsReport, 
  getAccountsReport,
  getSalesByDay 
} from '../../services/reportsService';

import { getDateRange, PeriodFilter as PeriodType } from '../../utils/reportDateUtils';
import { theme } from '../../theme/theme';
export default function Reports() {

  const [period, setPeriod] = useState<PeriodType>('month');

  const range = useMemo(() => getDateRange(period), [period]);
  const summary = useMemo(() => { return getSummaryReport(range); }, [range]);
  const financial = useMemo(() => getFinancialReport(range), [range]);
  const sales = useMemo(() => getSalesReport(range), [range]);
  const products = useMemo(() => getProductsReport(), []);
  const accounts = useMemo(() => getAccountsReport(), []);

  const salesByDay = useMemo(() => getSalesByDay(range), [range]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.colors.background }}
      >
        <Header />
        <PeriodFilter value={period} onChange={setPeriod} />
        <SummarySection summary={summary} />
        <SalesChart data={salesByDay} />
        <FinancialSection data={financial} />
        <SalesSection data={sales} />
        <ProductsSection data={products}/>
        <AccountsSection data={accounts}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 20,
  },
})