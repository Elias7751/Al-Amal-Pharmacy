import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchAddresses = async () => {
        try {
          const { data } = await api.get('/addresses');
          if (data.success) {
            setAddresses(data.addresses);
            const defaultAddr = data.addresses.find(a => a.is_default);
            if (defaultAddr) setSelectedAddress(defaultAddr.id);
            else if (data.addresses.length > 0) setSelectedAddress(data.addresses[0].id);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      if (data.success) {
        setDiscount(data.coupon.discount_percentage);
        toast.success(`تم تفعيل الكوبون! خصم ${data.coupon.discount_percentage}%`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "كود الخصم غير صالح أو منتهي");
      setDiscount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && user) {
      toast.error("يرجى اختيار عنوان التوصيل");
      return;
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        address_id: selectedAddress,
        coupon_code: discount > 0 ? couponCode : null,
      };
      const { data } = await api.post('/orders', orderData);
      
      if (data.success) {
        toast.success("تم إرسال الطلب بنجاح!");
        clearCart();
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء إتمام الطلب");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading) return <div className="spinner" style={{ margin: '5rem auto' }}></div>;
  if (!user) return <Navigate to="/login" />;
  if (cart.length === 0) return <Navigate to="/cart" />;

  const finalTotal = totalPrice - (totalPrice * discount) / 100;

  return (
    <div>
      <h1 style={styles.title}>إتمام الطلب</h1>
      
      <div style={styles.layout}>
        <div style={styles.mainContent}>
          
          <div className="card" style={styles.section}>
            <h2 style={styles.sectionTitle}>1. عنوان التوصيل</h2>
            {loading ? (
              <div className="spinner"></div>
            ) : addresses.length === 0 ? (
              <div style={{ padding: '1rem', backgroundColor: 'var(--warning)', color: 'white', borderRadius: 'var(--radius-md)' }}>
                لا توجد عناوين محفوظة. يرجى <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/profile')}>إضافة عنوان من الملف الشخصي</span> أولاً.
              </div>
            ) : (
              <div style={styles.addressGrid}>
                {addresses.map(addr => (
                  <div 
                    key={addr.id} 
                    style={{
                      ...styles.addressCard,
                      borderColor: selectedAddress === addr.id ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: selectedAddress === addr.id ? 'var(--primary-light)' : 'var(--background)'
                    }}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{addr.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{addr.city} - {addr.address_line}</p>
                    <p style={{ fontWeight: 'bold', fontSize: '0.875rem', marginTop: '0.5rem' }}>{addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={styles.section}>
            <h2 style={styles.sectionTitle}>2. طريقة الدفع</h2>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                <input type="radio" name="payment" checked readOnly />
                الدفع عند الاستلام
              </label>
            </div>
          </div>

        </div>

        <div style={styles.sidebar}>
          <div className="card" style={styles.summaryCard}>
            <h2 style={styles.sectionTitle}>ملخص الطلب</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              {cart.map(item => (
                <div key={item.cart_item_id} style={styles.summaryItem}>
                  <span style={{ flex: 1 }}>{item.name_ar}</span>
                  <span style={{ margin: '0 1rem' }}>x{item.quantity}</span>
                  <span style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toFixed(2)} ريال</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleApplyCoupon} style={styles.couponForm}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="كود الخصم"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">تفعيل</button>
            </form>

            <div style={styles.summaryRow}>
              <span>المجموع الفرعي</span>
              <span>{totalPrice.toFixed(2)} ريال</span>
            </div>
            
            {discount > 0 && (
              <div style={{ ...styles.summaryRow, color: 'var(--success)' }}>
                <span>الخصم ({discount}%)</span>
                <span>- {((totalPrice * discount) / 100).toFixed(2)} ريال</span>
              </div>
            )}

            <div style={styles.summaryRow}>
              <span>رسوم التوصيل</span>
              <span>مجاني</span>
            </div>

            <div style={styles.summaryTotal}>
              <span>الإجمالي</span>
              <span style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>{finalTotal.toFixed(2)} ريال</span>
            </div>

            <button 
              className="btn btn-primary" 
              style={styles.placeOrderBtn}
              onClick={handlePlaceOrder}
              disabled={placingOrder || addresses.length === 0 || !selectedAddress}
            >
              {placingOrder ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'تأكيد الطلب'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem'
  },
  layout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start'
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  section: {
    padding: '2rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  addressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem'
  },
  addressCard: {
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  sidebar: {
    width: '400px',
    flexShrink: 0
  },
  summaryCard: {
    padding: '2rem',
    position: 'sticky',
    top: '100px'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px dashed var(--border)',
    fontSize: '0.875rem'
  },
  couponForm: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    padding: '1.5rem 0',
    borderBottom: '1px solid var(--border)',
    borderTop: '1px solid var(--border)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '1rem',
    color: 'var(--text-muted)'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border)',
    fontWeight: '800',
    fontSize: '1.25rem'
  },
  placeOrderBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.125rem',
    marginTop: '2rem'
  }
};
