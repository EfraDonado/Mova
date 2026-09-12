import { subDays } from 'date-fns';
import { roundMoney } from './finance';
import type { BusinessProfile, Expense, Investment, Product, Sale, Transaction } from './types';

const now = new Date();

export const demoProfile: BusinessProfile = {
  id: 'business-mova',
  name: 'Mova Studio',
  type: 'store',
  currency: 'COP',
  initialBalance: 1200000,
  createdAt: subDays(now, 20).toISOString()
};

export const demoProducts: Product[] = [
  {
    id: 'prd-hamburguesa',
    name: 'Hamburguesa Especial',
    description: 'Producto estrella con alto margen y rotación estable.',
    category: 'Comida',
    purchasePrice: 12000,
    salePrice: 25000,
    stock: 18,
    minStock: 6,
    supplier: 'Cocina Central',
    code: 'HAM-ESP-01',
    status: 'active',
    createdAt: subDays(now, 18).toISOString(),
    updatedAt: subDays(now, 2).toISOString()
  },
  {
    id: 'prd-camiseta',
    name: 'Camiseta Básica',
    description: 'Prenda esencial de alta demanda en temporada media.',
    category: 'Ropa',
    purchasePrice: 18000,
    salePrice: 42000,
    stock: 9,
    minStock: 5,
    supplier: 'Textiles Norte',
    code: 'CAM-BAS-11',
    status: 'active',
    createdAt: subDays(now, 17).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  },
  {
    id: 'prd-gaseosa',
    name: 'Gaseosa',
    description: 'Complemento de venta rápida con rotación diaria.',
    category: 'Bebidas',
    purchasePrice: 3500,
    salePrice: 6500,
    stock: 4,
    minStock: 10,
    supplier: 'Distribuciones Sol',
    code: 'GAS-330',
    status: 'paused',
    createdAt: subDays(now, 16).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  },
  {
    id: 'prd-accesorio',
    name: 'Accesorio X',
    description: 'Accesorio de compra impulsiva con margen atractivo.',
    category: 'Accesorios',
    purchasePrice: 7000,
    salePrice: 16000,
    stock: 0,
    minStock: 8,
    supplier: 'Mundo Accesorios',
    code: 'ACC-X-09',
    status: 'out_of_stock',
    createdAt: subDays(now, 15).toISOString(),
    updatedAt: subDays(now, 1).toISOString()
  }
];

export const demoTransactions: Transaction[] = [
  {
    id: 'txn-1',
    kind: 'sale',
    title: 'Venta Hamburguesa Especial',
    amount: 75000,
    category: 'Ventas',
    method: 'cash',
    relatedId: 'sale-1',
    createdAt: subDays(now, 1).toISOString()
  },
  {
    id: 'txn-2',
    kind: 'purchase',
    title: 'Compra inventario',
    amount: 120000,
    category: 'Inventario',
    method: 'transfer',
    createdAt: subDays(now, 2).toISOString()
  },
  {
    id: 'txn-3',
    kind: 'expense',
    title: 'Publicidad local',
    amount: 68000,
    category: 'Publicidad',
    method: 'card',
    createdAt: subDays(now, 3).toISOString()
  },
  {
    id: 'txn-4',
    kind: 'sale',
    title: 'Venta Camiseta Básica',
    amount: 168000,
    category: 'Ventas',
    method: 'transfer',
    relatedId: 'sale-2',
    createdAt: subDays(now, 4).toISOString()
  },
  {
    id: 'txn-5',
    kind: 'investment',
    title: 'Nuevo horno',
    amount: 1500000,
    category: 'Equipamiento',
    method: 'transfer',
    createdAt: subDays(now, 8).toISOString()
  }
];

export const demoSales: Sale[] = [
  {
    id: 'sale-1',
    createdAt: subDays(now, 1).toISOString(),
    paymentMethod: 'cash',
    subtotal: 81000,
    totalCost: 39000,
    total: 75000,
    profit: 36000
  },
  {
    id: 'sale-2',
    createdAt: subDays(now, 4).toISOString(),
    paymentMethod: 'transfer',
    subtotal: 180000,
    totalCost: 84000,
    total: 168000,
    profit: 84000
  }
];

export const demoExpenses: Expense[] = [
  {
    id: 'exp-1',
    description: 'Publicidad local',
    category: 'Publicidad',
    amount: 68000,
    method: 'card',
    createdAt: subDays(now, 3).toISOString()
  },
  {
    id: 'exp-2',
    description: 'Transporte de insumos',
    category: 'Transporte',
    amount: 25000,
    method: 'cash',
    createdAt: subDays(now, 6).toISOString()
  }
];

export const demoInvestments: Investment[] = [
  {
    id: 'inv-1',
    description: 'Nuevo horno',
    category: 'Equipamiento',
    amount: 1500000,
    createdAt: subDays(now, 8).toISOString()
  }
];

export function deriveSeedBalance() {
  return roundMoney(demoProfile.initialBalance);
}