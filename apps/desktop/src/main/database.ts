import initSqlJs from 'sql.js';
import { app } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import initSqlJs from 'sql.js';
import { app } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { buildDashboardMetrics, buildReportSummary, demoExpenses, demoInvestments, demoProducts, demoProfile, demoSales, demoTransactions } from '@mova/core';
import type { AppSnapshot, BusinessProfile, Expense, Investment, Product, Sale, SaleItem, Transaction } from '@mova/core';
import { z } from 'zod';

const require = createRequire(import.meta.url);
const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');

const businessSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['restaurant', 'store', 'fashion', 'food', 'accessories', 'family', 'other']),
  currency: z.enum(['COP', 'USD', 'MXN', 'EUR', 'CLP', 'ARS', 'PEN']),
  initialBalance: z.number().nonnegative(),
  createdAt: z.string()
});

function toJson<T>(value: T) {
  return JSON.stringify(value);
}

function fromJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function nowISO() {
  return new Date().toISOString();
}

function queryAll<T>(db: import('sql.js').Database, sql: string, params: unknown[] = []) {
  const statement = db.prepare(sql);
  statement.bind(params);
  const rows: T[] = [];
  while (statement.step()) {
    rows.push(statement.getAsObject() as T);
  }
  statement.free();
  return rows;
}

function queryOne<T>(db: import('sql.js').Database, sql: string, params: unknown[] = []) {
  return queryAll<T>(db, sql, params)[0];
}

function execRun(db: import('sql.js').Database, sql: string, params: unknown[] = []) {
  const statement = db.prepare(sql);
  statement.bind(params);
  statement.step();
  statement.free();
}

export class MovaDatabase {
  private db!: import('sql.js').Database;
  private readonly dbPath = join(app.getPath('userData'), 'mova.sqlite');
  private SQL!: Awaited<ReturnType<typeof initSqlJs>>;

  async initialize() {
    mkdirSync(dirname(this.dbPath), { recursive: true });
    this.SQL = await initSqlJs({ locateFile: () => wasmPath });
    this.db = existsSync(this.dbPath) ? new this.SQL.Database(readFileSync(this.dbPath)) : new this.SQL.Database();
    this.bootstrapSchema();
    this.seedIfEmpty();
    this.persist();
  }

  private persist() {
    writeFileSync(this.dbPath, Buffer.from(this.db.export()));
  }

  private bootstrapSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        purchasePrice INTEGER NOT NULL,
        salePrice INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        minStock INTEGER NOT NULL,
        supplier TEXT NOT NULL,
        code TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        category TEXT NOT NULL,
        method TEXT NOT NULL,
        note TEXT,
        relatedId TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        createdAt TEXT NOT NULL,
        paymentMethod TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        totalCost INTEGER NOT NULL,
        total INTEGER NOT NULL,
        profit INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sale_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        saleId TEXT NOT NULL,
        productId TEXT NOT NULL,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice INTEGER NOT NULL,
        unitCost INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        method TEXT NOT NULL,
        note TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS investments (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        amount INTEGER NOT NULL,
        note TEXT,
        createdAt TEXT NOT NULL
      );
    `);
  }

  private seedIfEmpty() {
    const themeCount = queryOne<{ count: number }>(this.db, 'SELECT COUNT(*) as count FROM settings WHERE key = ?', ['theme']);
    if ((themeCount?.count ?? 0) === 0) {
      this.saveTheme('dark');
    }
  }

  getProfile() {
    const row = queryOne<{ value?: string }>(this.db, 'SELECT value FROM settings WHERE key = ?', ['profile']);
    const raw = fromJson<BusinessProfile | null>(row?.value ?? null, null);
    return raw && businessSchema.safeParse(raw).success ? raw : null;
  }

  saveProfile(profile: BusinessProfile) {
    execRun(this.db, 'INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', ['profile', toJson(profile)]);
    this.persist();
  }

  getTheme() {
    const row = queryOne<{ value?: string }>(this.db, 'SELECT value FROM settings WHERE key = ?', ['theme']);
    return (row?.value as 'dark' | 'light' | undefined) ?? 'dark';
  }

  saveTheme(theme: 'dark' | 'light') {
    execRun(this.db, 'INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', ['theme', theme]);
    this.persist();
  }

  getProducts() {
    return queryAll<Product>(this.db, 'SELECT * FROM products ORDER BY createdAt DESC');
  }

  getTransactions() {
    return queryAll<Transaction>(this.db, 'SELECT * FROM transactions ORDER BY createdAt DESC');
  }

  getSales() {
    return queryAll<Sale>(this.db, 'SELECT * FROM sales ORDER BY createdAt DESC');
  }

  getSaleItems(saleId: string) {
    return queryAll<SaleItem>(this.db, 'SELECT productId, name, quantity, unitPrice, unitCost FROM sale_items WHERE saleId = ?', [saleId]);
  }

  getExpenses() {
    return queryAll<Expense>(this.db, 'SELECT * FROM expenses ORDER BY createdAt DESC');
  }

  getInvestments() {
    return queryAll<Investment>(this.db, 'SELECT * FROM investments ORDER BY createdAt DESC');
  }

  saveProduct(product: Product) {
    execRun(this.db, `
      INSERT INTO products (id, name, description, category, purchasePrice, salePrice, stock, minStock, supplier, code, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        category = excluded.category,
        purchasePrice = excluded.purchasePrice,
        salePrice = excluded.salePrice,
        stock = excluded.stock,
        minStock = excluded.minStock,
        supplier = excluded.supplier,
        code = excluded.code,
        status = excluded.status,
        updatedAt = excluded.updatedAt
    `, [
      product.id,
      product.name,
      product.description,
      product.category,
      product.purchasePrice,
      product.salePrice,
      product.stock,
      product.minStock,
      product.supplier,
      product.code,
      product.status,
      product.createdAt,
      product.updatedAt
    ]);
    this.persist();
  }

  deleteProduct(id: string) {
    execRun(this.db, 'DELETE FROM products WHERE id = ?', [id]);
    this.persist();
  }

  saveExpense(expense: Expense) {
    this.db.exec('BEGIN');
    try {
      execRun(this.db, 'INSERT INTO expenses VALUES (?, ?, ?, ?, ?, ?, ?)', [
        expense.id,
        expense.description,
        expense.category,
        expense.amount,
        expense.method,
        expense.note ?? null,
        expense.createdAt
      ]);
      execRun(this.db, 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        expense.id,
        'expense',
        expense.description,
        expense.amount,
        expense.category,
        expense.method,
        expense.note ?? null,
        null,
        expense.createdAt
      ]);
      this.db.exec('COMMIT');
      this.persist();
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  saveInvestment(investment: Investment) {
    this.db.exec('BEGIN');
    try {
      execRun(this.db, 'INSERT INTO investments VALUES (?, ?, ?, ?, ?, ?)', [
        investment.id,
        investment.description,
        investment.category,
        investment.amount,
        investment.note ?? null,
        investment.createdAt
      ]);
      execRun(this.db, 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        investment.id,
        'investment',
        investment.description,
        investment.amount,
        investment.category,
        'transfer',
        investment.note ?? null,
        null,
        investment.createdAt
      ]);
      this.db.exec('COMMIT');
      this.persist();
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  saveSale(input: { paymentMethod: Sale['paymentMethod']; items: Array<{ productId: string; quantity: number }>; }) {
    this.db.exec('BEGIN');
    try {
      const selectedProducts: Product[] = [];
      for (const item of input.items) {
        const product = queryOne<Product>(this.db, 'SELECT * FROM products WHERE id = ?', [item.productId]);
        if (!product) throw new Error(`No existe el producto ${item.productId}`);
        if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);
        selectedProducts.push(product);
      }

      const saleId = `sale-${Date.now()}`;
      const createdAt = nowISO();
      let subtotal = 0;
      let totalCost = 0;

      for (const item of input.items) {
        const product = selectedProducts.find((entry) => entry.id === item.productId)!;
        const lineSubtotal = product.salePrice * item.quantity;
        const lineCost = product.purchasePrice * item.quantity;
        subtotal += lineSubtotal;
        totalCost += lineCost;

        const updatedStock = product.stock - item.quantity;
        const nextStatus = updatedStock <= 0 ? 'out_of_stock' : updatedStock <= product.minStock ? 'paused' : 'active';
        execRun(this.db, 'UPDATE products SET stock = ?, status = ?, updatedAt = ? WHERE id = ?', [updatedStock, nextStatus, createdAt, product.id]);
        execRun(this.db, 'INSERT INTO sale_items (saleId, productId, name, quantity, unitPrice, unitCost) VALUES (?, ?, ?, ?, ?, ?)', [
          saleId,
          product.id,
          product.name,
          item.quantity,
          product.salePrice,
          product.purchasePrice
        ]);
      }

      const total = subtotal;
      const profit = subtotal - totalCost;

      execRun(this.db, 'INSERT INTO sales VALUES (?, ?, ?, ?, ?, ?, ?)', [saleId, createdAt, input.paymentMethod, subtotal, totalCost, total, profit]);
      execRun(this.db, 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
        `txn-${Date.now()}`,
        'sale',
        'Venta registrada',
        total,
        'Ventas',
        input.paymentMethod,
        null,
        saleId,
        createdAt
      ]);

      this.db.exec('COMMIT');
      this.persist();
      return { saleId, createdAt, subtotal, totalCost, total, profit };
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  saveTransaction(transaction: Transaction) {
    execRun(this.db, 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      transaction.id,
      transaction.kind,
      transaction.title,
      transaction.amount,
      transaction.category,
      transaction.method,
      transaction.note ?? null,
      transaction.relatedId ?? null,
      transaction.createdAt
    ]);
    this.persist();
  }

  saveDemoData() {
    this.db.exec('BEGIN');
    try {
      this.db.exec('DELETE FROM products; DELETE FROM transactions; DELETE FROM sales; DELETE FROM sale_items; DELETE FROM expenses; DELETE FROM investments;');

      for (const product of demoProducts) {
        execRun(this.db, `
          INSERT INTO products (id, name, description, category, purchasePrice, salePrice, stock, minStock, supplier, code, status, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          product.id,
          product.name,
          product.description,
          product.category,
          product.purchasePrice,
          product.salePrice,
          product.stock,
          product.minStock,
          product.supplier,
          product.code,
          product.status,
          product.createdAt,
          product.updatedAt
        ]);
      }

      for (const transaction of demoTransactions) {
        execRun(this.db, 'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
          transaction.id,
          transaction.kind,
          transaction.title,
          transaction.amount,
          transaction.category,
          transaction.method,
          transaction.note ?? null,
          transaction.relatedId ?? null,
          transaction.createdAt
        ]);
      }

      for (const sale of demoSales) {
        execRun(this.db, 'INSERT INTO sales VALUES (?, ?, ?, ?, ?, ?, ?)', [sale.id, sale.createdAt, sale.paymentMethod, sale.subtotal, sale.totalCost, sale.total, sale.profit]);
      }

      for (const expense of demoExpenses) {
        execRun(this.db, 'INSERT INTO expenses VALUES (?, ?, ?, ?, ?, ?, ?)', [
          expense.id,
          expense.description,
          expense.category,
          expense.amount,
          expense.method,
          expense.note ?? null,
          expense.createdAt
        ]);
      }

      for (const investment of demoInvestments) {
        execRun(this.db, 'INSERT INTO investments VALUES (?, ?, ?, ?, ?, ?)', [
          investment.id,
          investment.description,
          investment.category,
          investment.amount,
          investment.note ?? null,
          investment.createdAt
        ]);
      }

      this.db.exec('COMMIT');
      this.persist();
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  clearDemoData() {
    this.db.exec('DELETE FROM products; DELETE FROM transactions; DELETE FROM sales; DELETE FROM sale_items; DELETE FROM expenses; DELETE FROM investments;');
    this.persist();
  }

  snapshot(): AppSnapshot {
    const profile = this.getProfile();
    const products = this.getProducts();
    const transactions = this.getTransactions();
    const sales = this.getSales();
    const expenses = this.getExpenses();
    const investments = this.getInvestments();
    const safeProfile = profile ?? demoProfile;
    const dashboard = buildDashboardMetrics({
      profileInitialBalance: safeProfile.initialBalance,
      products,
      sales,
      expenses,
      investments,
      transactions
    });
    const report = buildReportSummary({ sales, expenses, investments, transactions });

    return {
      profile,
      products,
      transactions,
      sales,
      expenses,
      investments,
      dashboard,
      report,
      theme: this.getTheme(),
      demoEnabled: products.length > 0 || transactions.length > 0
    };
  }
}