import type { AppSnapshot, BusinessProfile, Expense, Investment, Product, Transaction } from '@mova/core';

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function unwrap<T>(promise: Promise<Result<T>>) {
  const result = await promise;
  if (!result.ok) throw new Error(result.error);
  return result.data;
}

export const movaApi = {
  snapshot: () => unwrap<AppSnapshot>(window.mova.snapshot()),
  updateProfile: (profile: BusinessProfile) => unwrap<AppSnapshot>(window.mova.updateProfile(profile)),
  setTheme: (theme: 'dark' | 'light') => unwrap<'dark' | 'light'>(window.mova.setTheme(theme)),
  saveProduct: (product: Product) => unwrap<AppSnapshot>(window.mova.saveProduct(product)),
  deleteProduct: (id: string) => unwrap<AppSnapshot>(window.mova.deleteProduct(id)),
  saveExpense: (expense: Expense) => unwrap<AppSnapshot>(window.mova.saveExpense(expense)),
  saveInvestment: (investment: Investment) => unwrap<AppSnapshot>(window.mova.saveInvestment(investment)),
  saveSale: (payload: { paymentMethod: 'cash' | 'transfer' | 'card' | 'other'; items: Array<{ productId: string; quantity: number }> }) =>
    unwrap<{ sale: unknown; snapshot: AppSnapshot }>(window.mova.saveSale(payload)),
  saveTransaction: (transaction: Transaction) => unwrap<AppSnapshot>(window.mova.saveTransaction(transaction)),
  seedDemo: () => unwrap<AppSnapshot>(window.mova.seedDemo()),
  clearDemo: () => unwrap<AppSnapshot>(window.mova.clearDemo())
};