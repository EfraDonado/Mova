import { format } from 'date-fns';
import type { DashboardMetrics, Expense, Investment, Product, ReportSummary, Sale, Transaction } from './types';

export function currencyValue(value: number, currency = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function safeNumber(value: unknown) {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function roundMoney(value: number) {
  return Math.round(value);
}

export function productProfit(product: Product) {
  return Math.max(0, product.salePrice - product.purchasePrice);
}

export function productMargin(product: Product) {
  if (product.salePrice <= 0) return 0;
  return (productProfit(product) / product.salePrice) * 100;
}

export function inventoryValue(products: Product[]) {
  return products.reduce((total, product) => total + product.purchasePrice * product.stock, 0);
}

export function saleProfit(sale: Sale) {
  return sale.profit;
}

export function computeAvailableCash(profileInitialBalance: number, transactions: Transaction[]) {
  return roundMoney(
    profileInitialBalance +
      transactions.reduce((balance, item) => {
        if (item.kind === 'income' || item.kind === 'sale') return balance + item.amount;
        return balance - item.amount;
      }, 0)
  );
}

function dayLabel(dateISO: string) {
  return format(new Date(dateISO), 'dd MMM');
}

export function buildTrend(transactions: Transaction[]) {
  const lastDays = [...transactions]
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
    .slice(-7);
  return lastDays.map((item) => ({
    label: dayLabel(item.createdAt),
    income: item.kind === 'income' || item.kind === 'sale' ? item.amount : 0,
    expense: item.kind === 'income' || item.kind === 'sale' ? 0 : item.amount
  }));
}

export function buildDashboardMetrics(params: {
  profileInitialBalance: number;
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  investments: Investment[];
  transactions: Transaction[];
}): DashboardMetrics {
  const { profileInitialBalance, products, sales, expenses, investments, transactions } = params;
  const income = transactions.filter((item) => item.kind === 'income' || item.kind === 'sale').reduce((sum, item) => sum + item.amount, 0);
  const expenseTotal = transactions.filter((item) => item.kind !== 'income' && item.kind !== 'sale').reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const netProfit = grossProfit - expenses.reduce((sum, item) => sum + item.amount, 0);
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= product.minStock).length;
  const outOfStockCount = products.filter((product) => product.stock <= 0).length;
  const rankedProduct = [...products]
    .map((product) => ({
      product,
      profit: (product.salePrice - product.purchasePrice) * Math.max(product.stock, 1)
    }))
    .sort((left, right) => right.profit - left.profit)[0];
  const cashFlowTrend = buildTrend(transactions);

  const alerts = [
    lowStockCount > 0
      ? { type: 'warning' as const, title: 'Stock sensible', detail: `${lowStockCount} producto${lowStockCount === 1 ? '' : 's'} requiere${lowStockCount === 1 ? '' : 'n'} reposición.` }
      : { type: 'info' as const, title: 'Inventario estable', detail: 'No hay alertas urgentes de inventario.' },
    outOfStockCount > 0
      ? { type: 'critical' as const, title: 'Sin existencias', detail: `${outOfStockCount} producto${outOfStockCount === 1 ? '' : 's'} está${outOfStockCount === 1 ? '' : 'n'} agotado${outOfStockCount === 1 ? '' : 's'}.` }
      : { type: 'info' as const, title: 'Stock sano', detail: 'Todos los productos tienen al menos una unidad disponible.' },
    investments.length > 0
      ? { type: 'info' as const, title: 'Capital invertido', detail: `Has destinado ${investments.length} inversión${investments.length === 1 ? '' : 'es'} al negocio.` }
      : { type: 'info' as const, title: 'Aún sin inversiones', detail: 'Puedes registrar compras de equipos y mejoras.' }
  ];

  return {
    availableCash: computeAvailableCash(profileInitialBalance, transactions),
    totalIncome: income,
    totalExpenses: expenseTotal,
    totalSales: sales.reduce((sum, sale) => sum + sale.total, 0),
    grossProfit,
    netProfit,
    inventoryValue: inventoryValue(products),
    lowStockCount,
    outOfStockCount,
    topProductName: rankedProduct?.product.name ?? 'Aún no hay datos',
    topProductProfit: rankedProduct?.profit ?? 0,
    cashFlowTrend,
    alerts
  };
}

export function buildReportSummary(params: {
  sales: Sale[];
  expenses: Expense[];
  investments: Investment[];
  transactions: Transaction[];
}): ReportSummary {
  const income = params.transactions.filter((item) => item.kind === 'income' || item.kind === 'sale').reduce((sum, item) => sum + item.amount, 0);
  const cost = params.sales.reduce((sum, sale) => sum + sale.totalCost, 0);
  const expensesTotal = params.expenses.reduce((sum, item) => sum + item.amount, 0);
  const investmentsTotal = params.investments.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = income - cost;
  const netProfit = grossProfit - expensesTotal - investmentsTotal;

  const byDayMap = new Map<string, { income: number; expense: number; profit: number }>();
  for (const transaction of params.transactions) {
    const label = dayLabel(transaction.createdAt);
    const current = byDayMap.get(label) ?? { income: 0, expense: 0, profit: 0 };
    const delta = transaction.kind === 'income' || transaction.kind === 'sale' ? transaction.amount : -transaction.amount;
    current.profit += delta;
    if (delta > 0) current.income += delta;
    else current.expense += Math.abs(delta);
    byDayMap.set(label, current);
  }

  return {
    income,
    cost,
    expenses: expensesTotal,
    investments: investmentsTotal,
    grossProfit,
    netProfit,
    byDay: [...byDayMap.entries()].map(([label, values]) => ({ label, ...values }))
  };
}