import { useMemo, useState } from 'react';
import { AppButton, Field, GlassPanel, Input, Pill, Select, SectionHeader, Textarea } from '../components/ui';
import { currencyValue, productMargin, productProfit, prettyDate, statusTone } from '../lib/format';
import type { AppSnapshot, Product, ProductStatus } from '@mova/core';

const statuses: ProductStatus[] = ['active', 'paused', 'out_of_stock'];

export function ProductsPage({ snapshot, onSaveProduct, onDeleteProduct }: { snapshot: AppSnapshot; onSaveProduct: (product: Product) => Promise<void>; onDeleteProduct: (id: string) => Promise<void> }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<Product>(emptyProduct());

  function emptyProduct(): Product {
    return {
      id: `prd-${Date.now()}`,
      name: '',
      description: '',
      category: '',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      minStock: 0,
      supplier: '',
      code: '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  const products = useMemo(() => snapshot.products, [snapshot.products]);

  function edit(product: Product) {
    setSelected(product);
    setForm(product);
  }

  async function submit() {
    await onSaveProduct({ ...form, updatedAt: new Date().toISOString() });
    setSelected(null);
    setForm(emptyProduct());
  }

  return (
    <div className="page-grid page-grid--two-col">
      <GlassPanel>
        <SectionHeader eyebrow="Catálogo" title={selected ? 'Editar producto' : 'Nuevo producto'} action={<Pill tone="neutral">{products.length} ítems</Pill>} />
        <div className="form-grid">
          <Field label="Nombre"><Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></Field>
          <Field label="Código"><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></Field>
          <Field label="Categoría"><Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Field>
          <Field label="Proveedor"><Input value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} /></Field>
          <Field label="Costo"><Input type="number" value={form.purchasePrice} onChange={(event) => setForm({ ...form, purchasePrice: Number(event.target.value) })} /></Field>
          <Field label="Precio de venta"><Input type="number" value={form.salePrice} onChange={(event) => setForm({ ...form, salePrice: Number(event.target.value) })} /></Field>
          <Field label="Stock"><Input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} /></Field>
          <Field label="Stock mínimo"><Input type="number" value={form.minStock} onChange={(event) => setForm({ ...form, minStock: Number(event.target.value) })} /></Field>
          <Field label="Estado"><Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}>{statuses.map((option) => <option key={option}>{option}</option>)}</Select></Field>
          <Field label="Descripción"><Textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></Field>
        </div>
        <div className="action-row"><AppButton onClick={submit} disabled={!form.name}>Guardar producto</AppButton><AppButton variant="ghost" onClick={() => { setSelected(null); setForm(emptyProduct()); }}>Limpiar</AppButton></div>
      </GlassPanel>

      <GlassPanel>
        <SectionHeader eyebrow="Inventario" title="Productos y rentabilidad" />
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-card__top">
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>
                <Pill tone={statusTone(product) === 'critical' ? 'critical' : statusTone(product) === 'warning' ? 'warning' : 'positive'}>{product.status}</Pill>
              </div>
              <p>{product.description}</p>
              <div className="product-stats">
                <div><span>Costo</span><strong>{currencyValue(product.purchasePrice, snapshot.profile?.currency ?? 'COP')}</strong></div>
                <div><span>Precio</span><strong>{currencyValue(product.salePrice, snapshot.profile?.currency ?? 'COP')}</strong></div>
                <div><span>Utilidad</span><strong>{currencyValue(productProfit(product), snapshot.profile?.currency ?? 'COP')}</strong></div>
                <div><span>Margen</span><strong>{productMargin(product).toFixed(1)}%</strong></div>
              </div>
              <div className="product-card__footer">
                <span>Stock {product.stock} · Mínimo {product.minStock}</span>
                <span>{prettyDate(product.updatedAt)}</span>
              </div>
              <div className="action-row action-row--tight">
                <AppButton variant="soft" onClick={() => edit(product)}>Editar</AppButton>
                <AppButton variant="ghost" onClick={() => onDeleteProduct(product.id)}>Eliminar</AppButton>
              </div>
            </article>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}