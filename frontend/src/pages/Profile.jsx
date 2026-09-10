import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserCircle, FaMapMarkerAlt, FaShoppingBag, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('orders');
  
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Address Form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', address_line: '', city: '', phone: '', is_default: false });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        api.get('/orders'),
        api.get('/addresses')
      ]);
      if (ordersRes.data.success) setOrders(ordersRes.data.orders);
      if (addressesRes.data.success) setAddresses(addressesRes.data.addresses);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/addresses', newAddress);
      if (data.success) {
        toast.success("تمت إضافة العنوان بنجاح");
        setShowAddressForm(false);
        setNewAddress({ title: '', address_line: '', city: '', phone: '', is_default: false });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا العنوان؟")) return;
    try {
      const { data } = await api.delete(`/addresses/${id}`);
      if (data.success) {
        toast.success("تم الحذف بنجاح");
        fetchData();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  if (authLoading) return <div className="spinner" style={{ margin: '5rem auto' }}></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaUserCircle size={80} color="var(--primary)" />
        <div>
          <h1 style={styles.name}>{user.name}</h1>
          <p style={styles.phone}>{user.phone}</p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <button 
            style={{ ...styles.tabBtn, ...(activeTab === 'orders' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> طلباتي
          </button>
          <button 
            style={{ ...styles.tabBtn, ...(activeTab === 'addresses' ? styles.activeTab : {}) }}
            onClick={() => setActiveTab('addresses')}
          >
            <FaMapMarkerAlt /> عناويني
          </button>
        </aside>

        {/* Main Area */}
        <main style={styles.main}>
          {loading ? (
            <div className="spinner" style={{ margin: '3rem auto' }}></div>
          ) : activeTab === 'orders' ? (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>سجل الطلبات</h2>
              {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>لا توجد طلبات سابقة.</p>
              ) : (
                <div style={styles.orderList}>
                  {orders.map(order => (
                    <div key={order.id} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <span style={styles.orderId}>طلب #{order.id}</span>
                        <span style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div style={styles.orderDetails}>
                        <span style={styles.orderStatus(order.status)}>{order.status}</span>
                        <span style={styles.orderTotal}>{order.total_price} ريال</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2>العناوين المحفوظة</h2>
                <button className="btn btn-primary" onClick={() => setShowAddressForm(!showAddressForm)}>
                  <FaPlus /> أضف عنوان جديد
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} style={styles.form}>
                  <div className="grid grid-cols-2">
                    <div className="form-group">
                      <label className="form-label">عنوان للعنوان (مثال: المنزل، العمل)</label>
                      <input type="text" className="form-control" value={newAddress.title} onChange={(e) => setNewAddress({...newAddress, title: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">المدينة</label>
                      <input type="text" className="form-control" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">العنوان بالتفصيل</label>
                    <textarea className="form-control" value={newAddress.address_line} onChange={(e) => setNewAddress({...newAddress, address_line: e.target.value})} required></textarea>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="form-group">
                      <label className="form-label">رقم هاتف للتواصل</label>
                      <input type="text" className="form-control" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                      <input type="checkbox" id="is_default" checked={newAddress.is_default} onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})} />
                      <label htmlFor="is_default" style={{ fontWeight: 'bold' }}>تعيين كعنوان افتراضي</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">حفظ العنوان</button>
                </form>
              )}

              {addresses.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>لا توجد عناوين محفوظة.</p>
              ) : (
                <div className="grid grid-cols-2">
                  {addresses.map(addr => (
                    <div key={addr.id} style={styles.addressCard}>
                      <div style={styles.addressHeader}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{addr.title} {addr.is_default && <span style={styles.defaultBadge}>الافتراضي</span>}</h3>
                        <button onClick={() => handleDeleteAddress(addr.id)} style={styles.deleteBtn}>
                          <FaTrash />
                        </button>
                      </div>
                      <p style={{ margin: '0.5rem 0', color: 'var(--text-muted)' }}>{addr.city} - {addr.address_line}</p>
                      <p style={{ fontWeight: 'bold' }}>📞 {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem 0'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    backgroundColor: 'var(--surface)',
    padding: '3rem',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '2rem'
  },
  name: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '0.5rem'
  },
  phone: {
    fontSize: '1.125rem',
    color: 'var(--text-muted)'
  },
  content: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start'
  },
  sidebar: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    backgroundColor: 'var(--surface)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  },
  tabBtn: {
    padding: '1rem',
    textAlign: 'right',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1.125rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'var(--text-muted)',
    transition: 'all 0.2s'
  },
  activeTab: {
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-dark)'
  },
  main: {
    flex: 1
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  orderCard: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    backgroundColor: 'var(--background)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    borderBottom: '1px dashed var(--border)',
    paddingBottom: '1rem'
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: '1.125rem'
  },
  orderDate: {
    color: 'var(--text-muted)'
  },
  orderDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  orderStatus: (status) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    backgroundColor: status === 'مكتمل' ? 'var(--primary-light)' : 'var(--warning)',
    color: status === 'مكتمل' ? 'var(--primary-dark)' : 'white'
  }),
  orderTotal: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'var(--primary)'
  },
  form: {
    backgroundColor: 'var(--background)',
    padding: '2rem',
    borderRadius: 'var(--radius-md)',
    marginBottom: '2rem',
    border: '1px solid var(--border)'
  },
  addressCard: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    backgroundColor: 'var(--background)'
  },
  addressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  defaultBadge: {
    fontSize: '0.75rem',
    backgroundColor: 'var(--secondary-light)',
    color: 'var(--secondary)',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm)',
    marginRight: '0.5rem',
    verticalAlign: 'middle'
  },
  deleteBtn: {
    color: 'var(--danger)',
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color 0.2s'
  }
};
