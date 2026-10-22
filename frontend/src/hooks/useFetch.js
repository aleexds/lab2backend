import { useState, useEffect, useCallback } from 'react';

export function useFetch(fetchFn, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  // Función para re-consultar manualmente desde botones o eventos
  const refetch = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Error en la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  // Carga inicial controlada sin llamadas síncronas a setState
  useEffect(() => {
    let isMounted = true;

    if (!autoFetch) return;

    async function fetchData() {
      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Error en la petición');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, autoFetch]);

  return { data, loading, error, refetch, setData };
}