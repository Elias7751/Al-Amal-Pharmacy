import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        toast.success(`تم تحديث الحالة إلى: ${newStatus}`);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        fetchOrders();
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التحديث');
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      if (data.success) {
        setSelectedOrder(data.order);
      }
    } catch (error) {
      toast.error('حدث خطأ في جلب تفاصيل الطلب');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>إدارة الطلبات</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>تاريخ الطلب</th>
              <th>العميل</th>
              <th>المبلغ الإجمالي</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 'bold' }}>#{order.id}</td>
                <td>{new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
                <td>{order.customer_name || `عميل #${order.user_id}`}</td>
                <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{order.total_amount || order.total_price} ريال</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={styles.statusSelect(order.status)}
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => openOrderDetails(order.id)}>
                    <FaEye /> تفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>تفاصيل الطلب #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}><FaTimes /></button>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p style={styles.detailLabel}>العميل</p>
                <p style={styles.detailValue}>{selectedOrder.customer_name || `عميل #${selectedOrder.user_id}`}</p>
              </div>
              <div>
                <p style={styles.detailLabel}>رقم الهاتف</p>
                <p style={styles.detailValue}>{selectedOrder.customer_phone || 'غير متوفر'}</p>
              </div>
              <div>
                <p style={styles.detailLabel}>تاريخ الطلب</p>
                <p style={styles.detailValue}>{new Date(selectedOrder.created_at).toLocaleString('ar-SA')}</p>
              </div>
              <div>
                <p style={styles.detailLabel}>الحالة الحالية</p>
                <p style={styles.detailValue}>
                  <span style={styles.statusBadge(selectedOrder.status)}>
                    {selectedOrder.status === 'completed' ? 'مكتمل' :
                     selectedOrder.status === 'cancelled' ? 'ملغي' :
                     selectedOrder.status === 'shipped' ? 'تم الشحن' : 'قيد الانتظار'}
                  </span>
                </p>
              </div>
            </div>

            <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>المنتجات المطلوبة</h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '2rem' }}>
              {selectedOrder.items && selectedOrder.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://placehold.co/40x40'} 
                      alt={item.product_name} 
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                    <span>{item.product_name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>الكمية: {item.quantity}</span>
                    <span style={{ fontWeight: 'bold' }}>{item.price * item.quantity} ريال</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>المبلغ الإجمالي</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{selectedOrder.total_amount || selectedOrder.total_price} ريال</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'right'
  },
  statusSelect: (status) => ({
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    backgroundColor: status === 'completed' ? '#d1fae5' : status === 'cancelled' ? '#fee2e2' : '#fef3c7',
    color: status === 'completed' ? '#065f46' : status === 'cancelled' ? '#991b1b' : '#92400e',
    fontWeight: 'bold',
    outline: 'none',
    cursor: 'pointer'
  }),
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'var(--surface)',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  detailLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    marginBottom: '0.25rem'
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: '1.125rem'
  },
  statusBadge: (status) => ({
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: status === 'completed' ? '#d1fae5' : status === 'cancelled' ? '#fee2e2' : '#fef3c7',
    color: status === 'completed' ? '#065f46' : status === 'cancelled' ? '#991b1b' : '#92400e',
  })
};
