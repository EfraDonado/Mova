import { format } from 'date-fns';
import { currencyValue, productMargin, productProfit } from '@mova/core';
import type { Product, Transaction } from '@mova/core';

export { currencyValue, productMargin, productProfit };

export function prettyDate(value: string) {
  return format(new Date(value), 'dd MMM yyyy');
}

export function shortDate(value: string) {
  return format(new Date(value), 'dd MMM');
}

export function movementLabel(transaction: Transaction) {
  return transaction.kind === 'sale' || transaction.kind === 'income' ? `+${currencyValue(transaction.amount)}` : `-${currencyValue(transaction.amount)}`;
}

export function statusTone(product: Product) {
  if (product.stock <= 0) return 'critical';
  if (product.stock <= product.minStock) return 'warning';
  return 'positive';
}