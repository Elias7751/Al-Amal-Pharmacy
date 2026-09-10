import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { useTranslation } from 'react-i18next';

const AdminOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders'); // Admin route returns all orders (handled by backend role check)
      setOrders(res.data.data.orders || []);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading && orders.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{t('admin.order_management')}</h1>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.order_id')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.customer')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.date')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.total')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.status')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.update_status')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>#{order.id}</td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div>{order.user?.firstName} {order.user?.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold' }}>
                  ${parseFloat(order.totalAmount).toFixed(2)}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: order.status === 'Delivered' ? 'var(--success)' : 
                                     order.status === 'Shipped' ? 'var(--primary)' : 'var(--primary-light)',
                    color: order.status === 'Pending' ? 'var(--primary)' : 'white'
                  }}>
                    {t(`admin.${order.status.toLowerCase()}`)}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                  >
                    <option value="Pending">{t('admin.pending')}</option>
                    <option value="Processing">{t('admin.processing')}</option>
                    <option value="Shipped">{t('admin.shipped')}</option>
                    <option value="Delivered">{t('admin.delivered')}</option>
                    <option value="Cancelled">{t('admin.cancelled')}</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_orders_found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
