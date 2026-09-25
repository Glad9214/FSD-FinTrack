import { useState, useCallback } from 'react';

/**
 * useApi — wraps an async API call with loading/error state
 * Usage:
 *   const { execute, loading, error, data } = useApi(transactionsAPI.getAll);
 *   await execute({ type: 'expense' });
 */
function useApi(apiFunc) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFunc(...args);
        setData(res.data);
        return res.data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
}

export default useApi;
