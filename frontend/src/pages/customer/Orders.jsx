import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        // response.data.data is the array of orders
        setOrders(response.data.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {location.state?.message && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--success)', color: 'white', borderRadius: 'var(--radius-md)', marginBottom: '2rem', textAlign: 'center' }}>
          {location.state.message}
        </div>
      )}

      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{t('orders.my_orders')}</h1>
      
      {orders.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>{t('orders.no_orders')}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{t('orders.order_number')}{order.id}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.125rem' }}>${parseFloat(order.totalAmount).toFixed(2)}</div>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    backgroundColor: order.status === 'Delivered' ? 'var(--success)' : 'var(--primary-light)',
                    color: order.status === 'Delivered' ? 'white' : 'var(--primary)'
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '1rem' }}>{t('orders.items')}</h4>
                {order.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <span>{item.quantity}x {item.product?.name || t('orders.unknown_product')}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
