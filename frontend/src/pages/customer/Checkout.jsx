import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CartContext } from '../../contexts/CartContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Tag } from 'lucide-react';

const Checkout = () => {
  const { t } = useTranslation();
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponErr, setCouponErr] = useState('');

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/addresses');
        const userAddresses = res.data.data;
        setAddresses(userAddresses);
        
        const defaultAddr = userAddresses.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setFormData(prev => ({ ...prev, shippingAddress: `${defaultAddr.addressLine}, ${defaultAddr.city}` }));
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
          setFormData(prev => ({ ...prev, shippingAddress: `${userAddresses[0].addressLine}, ${userAddresses[0].city}` }));
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };
    fetchAddresses();
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponMsg('');
    setCouponErr('');

    try {
      const res = await api.get(`/coupons/validate/${couponCode}`);
      setAppliedCoupon(res.data.data);
      setCouponMsg('تم تطبيق كود الخصم بنجاح!');
    } catch (err) {
      setCouponErr('الكود غير صالح أو منتهي الصلاحية.');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { ...formData };
      if (appliedCoupon) {
        payload.couponCode = appliedCoupon.code;
      }
      await api.post('/orders', payload);
      clearCart();
      navigate('/orders', { state: { message: 'تم تقديم طلبك بنجاح!' } });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'فشل تقديم الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = (subtotal * appliedCoupon.discountPercentage) / 100;
  }
  const total = subtotal - discountAmount;

  const handleAddressSelect = (e) => {
    const val = e.target.value;
    setSelectedAddressId(val);
    if (val === 'custom') {
      setFormData({ ...formData, shippingAddress: '' });
    } else {
      const addr = addresses.find(a => a.id === val);
      if (addr) {
        setFormData({ ...formData, shippingAddress: `${addr.addressLine}, ${addr.city}` });
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>إتمام الطلب</h1>
      
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: '1.5rem' }}>معلومات الشحن</h3>
          
          {addresses.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <select 
                value={selectedAddressId} 
                onChange={handleAddressSelect}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
              >
                {addresses.map(a => (
                  <option key={a.id} value={a.id}>{a.title} - {a.addressLine}, {a.city}</option>
                ))}
                <option value="custom">أدخل عنواناً مختلفاً...</option>
              </select>
            </div>
          )}

          {(!addresses.length || selectedAddressId === 'custom') && (
            <Input 
              label="عنوان الشحن"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              required
              placeholder="مثال: شارع الملك فهد، الرياض"
            />
          )}

          <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>طريقة الدفع</h3>
          <select 
            name="paymentMethod" 
            value={formData.paymentMethod} 
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem', fontSize: '1rem' }}
          >
            <option value="Cash on Delivery">الدفع عند الاستلام</option>
            <option value="Credit Card" disabled>بطاقة ائتمانية (قريباً)</option>
          </select>

          {/* Coupon Section */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} />
              كوبون الخصم
            </h4>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="أدخل كود الخصم هنا..."
                  disabled={!!appliedCoupon}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
                {couponMsg && <div style={{ color: 'var(--success)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{couponMsg}</div>}
                {couponErr && <div style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{couponErr}</div>}
              </div>
              {!appliedCoupon ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || validatingCoupon}
                >
                  تطبيق
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setAppliedCoupon(null); setCouponCode(''); setCouponMsg(''); }}
                >
                  إزالة
                </Button>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>المجموع الجزئي</span>
              <span>{subtotal.toFixed(2)} ر.س</span>
            </div>
            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--success)' }}>
                <span>الخصم ({appliedCoupon.discountPercentage}%)</span>
                <span>-{discountAmount.toFixed(2)} ر.س</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
              <span>إجمالي الطلب</span>
              <span style={{ color: 'var(--primary)' }}>{total.toFixed(2)} ر.س</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            style={{ width: '100%' }}
            isLoading={loading}
          >
            تقديم الطلب
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
