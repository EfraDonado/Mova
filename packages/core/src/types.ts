export type ThemeMode = 'dark' | 'light';

export type BusinessType =
  | 'restaurant'
  | 'store'
  | 'fashion'
  | 'food'
  | 'accessories'
  | 'family'
  | 'other';

export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'other';
export type MovementKind = 'income' | 'expense' | 'purchase' | 'investment' | 'sale';
export type ProductStatus = 'active' | 'paused' | 'out_of_stock';

export type Currency = 'COP' | 'USD' | 'MXN' | 'EUR' | 'CLP' | 'ARS' | 'PEN';

export interface BusinessProfile {
  id: string;
  name: string;
  type: BusinessType;
  currency: Currency;
  initialBalance: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  code: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  kind: MovementKind;
  title: string;
  amount: number;
  category: string;
  method: PaymentMethod;
  note?: string;
  relatedId?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

export interface Sale {
  id: string;
  createdAt: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  totalCost: number;
  total: number;
  profit: number;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
  createdAt: string;
}

export interface Investment {
  id: string;
  description: string;
  category: string;
  amount: number;
  note?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  availableCash: number;
  totalIncome: number;
  totalExpenses: number;
  totalSales: number;
  grossProfit: number;
  netProfit: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  topProductName: string;
  topProductProfit: number;
  cashFlowTrend: Array<{ label: string; income: number; expense: number }>;
  alerts: Array<{ type: 'info' | 'warning' | 'critical'; title: string; detail: string }>;
}

export interface ReportSummary {
  income: number;
  cost: number;
  expenses: number;
  investments: number;
  grossProfit: number;
  netProfit: number;
  byDay: Array<{ label: string; income: number; expense: number; profit: number }>;
}

export interface AppSnapshot {
  profile: BusinessProfile | null;
  products: Product[];
  transactions: Transaction[];
  sales: Sale[];
  expenses: Expense[];
  investments: Investment[];
  dashboard: DashboardMetrics;
  report: ReportSummary;
  theme: ThemeMode;
  demoEnabled: boolean;
}