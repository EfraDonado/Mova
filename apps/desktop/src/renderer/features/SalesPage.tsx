import { useMemo, useState } from 'react';
import { AppButton, Field, GlassPanel, Input, Pill, Select, SectionHeader } from '../components/ui';
import { currencyValue, prettyDate } from '../lib/format';
import type { AppSnapshot, PaymentMethod } from '@mova/core';

const methods: PaymentMethod[] = ['cash', 'transfer', 'card', 'other'];

type CartItem = { productId: string; quantity: number };

export function SalesPage({ snapshot, onSaveSale }: { snapshot: AppSnapshot; onSaveSale: (payload: { paymentMethod: PaymentMethod; items: CartItem[] }) => Promise<void> }) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(snapshot.products[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = useMemo(() => snapshot.products.find((product) => product.id === selectedProductId), [snapshot.products, selectedProductId]);

  const subtotal = cart.reduce((sum, item) => {
    const product = snapshot.products.find((entry) => entry.id === item.productId);
    return sum + (product?.salePrice ?? 0) * item.quantity;
  }, 0);

  const cost = cart.reduce((sum, item) => {
    const product = snapshot.products.find((entry) => entry.id === item.productId);
    return sum + (product?.purchasePrice ?? 0) * item.quantity;
  }, 0);

  async function addToCart() {
    if (!selectedProduct) return;
    setCart((current) => {
      const existing = current.find((entry) => entry.productId === selectedProduct.id);
      if (existing) return current.map((entry) => entry.productId === selectedProduct.id ? { ...entry, quantity: entry.quantity + quantity } : entry);
      return [...current, { productId: selectedProduct.id, quantity }];
    });
  }

  async function checkout() {
    await onSaveSale({ paymentMethod, items: cart });
    setCart([]);
  }

  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Venta rápida" title="Arma la operación en pocos pasos" />
        <div className="sale-builder">
          <Field label="Producto">
            <Select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
              {snapshot.products.map((product) => (
                <option key={product.id} value={product.id}>{product.name} · {currencyValue(product.salePrice, snapshot.profile?.currency ?? 'COP')}</option>
              ))}
            </Select>
          </Field>
          <Field label="Cantidad"><Input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} /></Field>
          <Field label="Método"><Select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}>{methods.map((method) => <option key={method}>{method}</option>)}</Select></Field>
          <div className="action-row"><AppButton onClick={addToCart}>Agregar al carrito</AppButton></div>
        </div>
        <div className="sale-cart">
          {cart.map((item) => {
            const product = snapshot.products.find((entry) => entry.id === item.productId)!;
            return (
              <article key={item.productId} className="cart-row">
                <div>
                  <strong>{product.name}</strong>
                  <span>{item.quantity} x {currencyValue(product.salePrice, snapshot.profile?.currency ?? 'COP')}</span>
                </div>
                <button className="link-action" onClick={() => setCart((current) => current.filter((entry) => entry.productId !== item.productId))} type="button">Quitar</button>
              </article>
            );
          })}
        </div>
        <div className="sale-summary">
          <div><span>Subtotal</span><strong>{currencyValue(subtotal, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Costo</span><strong>{currencyValue(cost, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <div><span>Utilidad</span><strong>{currencyValue(subtotal - cost, snapshot.profile?.currency ?? 'COP')}</strong></div>
          <AppButton onClick={checkout} disabled={!cart.length}>Registrar venta</AppButton>
        </div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Ventas recientes" title="Últimas operaciones cerradas" />
        <div className="table-list">
          {snapshot.sales.map((sale) => (
            <article key={sale.id} className="table-row">
              <div>
                <strong>{sale.id}</strong>
                <span>{prettyDate(sale.createdAt)} · {sale.paymentMethod}</span>
              </div>
              <div className="table-row__meta">
                <Pill tone="positive">{currencyValue(sale.total, snapshot.profile?.currency ?? 'COP')}</Pill>
                <span>Cost {currencyValue(sale.totalCost, snapshot.profile?.currency ?? 'COP')}</span>
                <strong>{currencyValue(sale.profit, snapshot.profile?.currency ?? 'COP')}</strong>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}