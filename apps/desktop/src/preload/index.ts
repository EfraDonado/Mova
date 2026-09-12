import { contextBridge, ipcRenderer } from 'electron';
import type { AppSnapshot, BusinessProfile, Expense, Investment, Product, Transaction } from '@mova/core';

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const api = {
  snapshot: () => ipcRenderer.invoke('mova:snapshot') as Promise<Result<AppSnapshot>>,
  updateProfile: (profile: BusinessProfile) => ipcRenderer.invoke('mova:update-profile', profile) as Promise<Result<AppSnapshot>>,
  setTheme: (theme: 'dark' | 'light') => ipcRenderer.invoke('mova:set-theme', theme) as Promise<Result<'dark' | 'light'>>,
  saveProduct: (product: Product) => ipcRenderer.invoke('mova:save-product', product) as Promise<Result<AppSnapshot>>,
  deleteProduct: (id: string) => ipcRenderer.invoke('mova:delete-product', id) as Promise<Result<AppSnapshot>>,
  saveExpense: (expense: Expense) => ipcRenderer.invoke('mova:save-expense', expense) as Promise<Result<AppSnapshot>>,
  saveInvestment: (investment: Investment) => ipcRenderer.invoke('mova:save-investment', investment) as Promise<Result<AppSnapshot>>,
  saveSale: (payload: { paymentMethod: 'cash' | 'transfer' | 'card' | 'other'; items: Array<{ productId: string; quantity: number }> }) => ipcRenderer.invoke('mova:save-sale', payload) as Promise<Result<{ sale: unknown; snapshot: AppSnapshot }>>,
  saveTransaction: (transaction: Transaction) => ipcRenderer.invoke('mova:save-transaction', transaction) as Promise<Result<AppSnapshot>>,
  seedDemo: () => ipcRenderer.invoke('mova:seed-demo') as Promise<Result<AppSnapshot>>,
  clearDemo: () => ipcRenderer.invoke('mova:clear-demo') as Promise<Result<AppSnapshot>>
};

contextBridge.exposeInMainWorld('mova', api);

export type MovaApi = typeof api;