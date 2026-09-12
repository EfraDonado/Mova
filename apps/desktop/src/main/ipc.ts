import type { IpcMain } from 'electron';
import type { BusinessProfile, Expense, Investment, Product, Transaction } from '@mova/core';
import { demoProfile } from '@mova/core';
import { MovaDatabase } from './database';

function respondWithError(error: unknown) {
  return {
    ok: false,
    error: error instanceof Error ? error.message : 'Error inesperado'
  };
}

export function registerIpcHandlers(ipcMain: IpcMain, database: MovaDatabase) {
  ipcMain.handle('mova:snapshot', () => {
    return { ok: true, data: database.snapshot() };
  });

  ipcMain.handle('mova:update-profile', (_event, profile: BusinessProfile) => {
    try {
      database.saveProfile(profile);
      return { ok: true, data: database.snapshot() };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:set-theme', (_event, theme: 'dark' | 'light') => {
    database.saveTheme(theme);
    return { ok: true, data: theme };
  });

  ipcMain.handle('mova:save-product', (_event, product: Product) => {
    try {
      database.saveProduct(product);
      return { ok: true, data: database.snapshot() };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:delete-product', (_event, id: string) => {
    database.deleteProduct(id);
    return { ok: true, data: database.snapshot() };
  });

  ipcMain.handle('mova:save-expense', (_event, expense: Expense) => {
    try {
      database.saveExpense(expense);
      return { ok: true, data: database.snapshot() };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:save-investment', (_event, investment: Investment) => {
    try {
      database.saveInvestment(investment);
      return { ok: true, data: database.snapshot() };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:save-sale', (_event, payload: { paymentMethod: 'cash' | 'transfer' | 'card' | 'other'; items: Array<{ productId: string; quantity: number }> }) => {
    try {
      const result = database.saveSale(payload);
      return { ok: true, data: { sale: result, snapshot: database.snapshot() } };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:save-transaction', (_event, transaction: Transaction) => {
    try {
      database.saveTransaction(transaction);
      return { ok: true, data: database.snapshot() };
    } catch (error) {
      return respondWithError(error);
    }
  });

  ipcMain.handle('mova:seed-demo', () => {
    database.saveProfile(demoProfile);
    database.saveDemoData();
    return { ok: true, data: database.snapshot() };
  });

  ipcMain.handle('mova:clear-demo', () => {
    database.clearDemoData();
    return { ok: true, data: database.snapshot() };
  });
}