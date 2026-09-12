import { useEffect, useState } from 'react';
import type { AppSnapshot } from '@mova/core';
import { movaApi } from '../lib/api';

export function useMovaSnapshot() {
  const [snapshot, setSnapshot] = useState<AppSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      const data = await movaApi.snapshot();
      setSnapshot(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo cargar Mova');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return { snapshot, loading, error, refresh, setSnapshot };
}