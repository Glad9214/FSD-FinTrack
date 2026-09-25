import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AddTransactionPage now redirects to /transactions since the
 * TransactionsPage already has a full add/edit modal.
 */
export default function AddTransactionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/transactions', { replace: true });
  }, [navigate]);

  return null;
}
