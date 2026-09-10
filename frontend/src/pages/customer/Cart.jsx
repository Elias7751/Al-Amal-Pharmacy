import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const Cart = () => {
  const { cart, loading } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading && !cart) return <Loader fullScreen />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>سلتك فارغة</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>لم تضف أي منتجات إلى سلتك بعد.</p>
        <Link to="/shop">
          <Button variant="primary" size="lg">تسوّق الآن</Button>
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>سلة المشتريات</h1>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 600px' }}>
          {cart.items.map((item) => (
            <div key={item.id} className="glass" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '1rem', borderRadius: 'var(--radius-lg)', alignItems: 'center' }}>
              <img 
                src={item.product?.images?.[0] || 'https://via.placeholder.com/100'} 
                alt={item.product?.name_ar || item.product?.name} 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.product?.name_ar || item.product?.name}</h3>
                <div style={{ color: 'var(--text-muted)' }}>السعر: {parseFloat(item.price).toFixed(2)} ر.س</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontWeight: 'bold' }}>الكمية: {item.quantity}</div>
                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                  {(item.price * item.quantity).toFixed(2)} ر.س
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>ملخص الطلب</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>المجموع الجزئي</span>
              <span>{total.toFixed(2)} ر.س</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              <span>الشحن</span>
              <span>يحدد عند الدفع</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
              <span>الإجمالي</span>
              <span style={{ color: 'var(--primary)' }}>{total.toFixed(2)} ر.س</span>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              متابعة الدفع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
