# Mova

Mova es una aplicación de escritorio para pequeños negocios construida para sentirse como un producto comercial real, no como un panel administrativo genérico. Centraliza caja, ventas, gastos, productos, inventario, inversiones, utilidad y reportes en una experiencia local-first para Windows.

## Características

- Dashboard financiero con lectura inmediata de caja, utilidad, flujo e inventario.
- Registro rápido de ventas con actualización automática de stock y utilidad.
- Gestión de productos con cálculo de margen, utilidad y valor de inventario.
- Movimientos de dinero con filtros por tipo, método y fecha.
- Gastos e inversiones con historial persistente.
- Onboarding inicial guiado y datos de demostración opcionales.
- Modo claro y oscuro con identidad visual propia.
- Base local con SQLite y arquitectura separada por capas.
- Landing page oficial compartiendo la misma marca visual.

## Tecnologías

- Electron
- React
- TypeScript
- Vite
- SQLite local con `better-sqlite3`
- Recharts
- Framer Motion

## Arquitectura

- `apps/desktop`: app de escritorio principal.
- `apps/web`: landing page oficial.
- `packages/core`: tipos, branding, cálculos financieros y datos semilla.

## Instalación

1. Instala dependencias en la raíz con `npm install`.
2. Ejecuta la app de escritorio con `npm run dev:desktop`.
3. Ejecuta la web con `npm run dev:web`.

## Ejecución

- Desktop: `npm run dev:desktop`
- Web: `npm run dev:web`

## Compilación

- Desktop: `npm run build:desktop`
- Web: `npm run build:web`
- Todo el workspace: `npm run build`

## EXE de Windows

La distribución de escritorio está preparada con Electron Builder. Cuando el proyecto tenga dependencias instaladas y compilación validada, el instalador se genera con:

- `npm run package:desktop`

Para publicarlo en GitHub como descarga directa:

1. Crea y sube un tag de versión, por ejemplo `v1.0.0`.
2. GitHub Actions ejecutará el workflow de [release](.github/workflows/release.yml).
3. El instalador `.exe` quedará adjunto en el release para descargarlo desde la página del proyecto.

## Capturas

Las capturas del producto deben agregarse una vez se ejecute la interfaz final. La landing está preparada para alojarlas sin cambiar la identidad visual.

## Roadmap

- Exportación a PDF y Excel.
- Reportes con filtros avanzados.
- Asistente inteligente sobre datos reales del negocio.
- Sincronización opcional entre dispositivos.
- Plantillas por tipo de negocio.

## Licencia

Proyecto preparado para uso y evolución futura por el propietario del repositorio.
