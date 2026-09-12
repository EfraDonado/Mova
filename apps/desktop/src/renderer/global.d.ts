import type { MovaApi } from '../preload';

declare global {
  interface Window {
    mova: MovaApi;
  }
}

export {};