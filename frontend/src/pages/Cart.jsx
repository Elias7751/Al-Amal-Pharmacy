import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowRight } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Cart() {
  const { cart, totalPrice, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={styles.emptyState}>
        <h2>يرجى تسجيل الدخول لعرض السلة</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>تسجيل الدخول</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.emptyState}>
        <img src="https://placehold.co/200x200/FFFFFF/E5E7EB?text=Cart+Empty" alt="Empty Cart" style={{ borderRadius: '50%', marginBottom: '2rem' }} />
        <h2>سلة التسوق فارغة</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>أضف بعض المنتجات لسلتك للبدء في التسوق.</p>
        <Link to="/shop" className="btn btn-primary">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>سلة التسوق ({cart.length} منتجات)</h1>
        <button onClick={clearCart} className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          إفراغ السلة
        </button>
      </div>

      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cart.map((item) => (
            <div key={item.cart_item_id} className="card" style={styles.cartItem}>
              <img 
                src={item.image ? `http://localhost:5000${item.image}` : 'https://placehold.co/100x100?text=Image'} 
                alt={item.name_ar} 
                style={styles.itemImage} 
              />
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name_ar}</h3>
                <p style={styles.itemPrice}>{item.price} ريال</p>
              </div>
              
              <div style={styles.quantityWrapper}>
                <button 
                  style={styles.qtyBtn} 
                  onClick={() => addToCart(item.product_id, -1)}
                  disabled={item.quantity <= 1}
                >-</button>
                <input 
                  type="number" 
                  value={item.quantity} 
                  readOnly 
                  style={styles.qtyInput} 
                />
                <button 
                  style={styles.qtyBtn} 
                  onClick={() => addToCart(item.product_id, 1)}
                  disabled={item.stock <= item.quantity}
                >+</button>
              </div>

              <div style={styles.itemTotal}>
                {(item.price * item.quantity).toFixed(2)} ريال
              </div>

              <button onClick={() => removeFromCart(item.product_id)} style={styles.deleteBtn}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div style={styles.summarySidebar}>
          <div className="card" style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>ملخص الطلب</h3>
            <div style={styles.summaryRow}>
              <span>المجموع الفرعي</span>
              <span>{totalPrice.toFixed(2)} ريال</span>
            </div>
            <div style={styles.summaryRow}>
              <span>رسوم التوصيل</span>
              <span>مجاني</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
              <span>الإجمالي</span>
              <span>{totalPrice.toFixed(2)} ريال</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={styles.checkoutBtn}
              onClick={() => navigate('/checkout')}
            >
              متابعة الدفع <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800'
  },
  emptyState: {
    textAlign: 'center',
    padding: '5rem 0'
  },
  layout: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'flex-start'
  },
  itemsList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    gap: '1.5rem'
  },
  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  },
  itemPrice: {
    color: 'var(--primary)',
    fontWeight: '600'
  },
  quantityWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--surface)',
    overflow: 'hidden'
  },
  qtyBtn: {
    padding: '0.5rem 0.75rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    backgroundColor: 'var(--surface-hover)',
  },
  qtyInput: {
    width: '40px',
    textAlign: 'center',
    border: 'none',
    borderLeft: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    fontWeight: 'bold',
    padding: '0.5rem 0'
  },
  itemTotal: {
    fontWeight: '800',
    fontSize: '1.125rem',
    minWidth: '100px',
    textAlign: 'left'
  },
  deleteBtn: {
    color: 'var(--danger)',
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1.25rem',
    transition: 'opacity 0.2s'
  },
  summarySidebar: {
    width: '350px',
    flexShrink: 0
  },
  summaryCard: {
    padding: '2rem'
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    color: 'var(--text-muted)'
  },
  summaryTotal: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border)',
    color: 'var(--text-main)',
    fontWeight: '800',
    fontSize: '1.25rem'
  },
  checkoutBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.125rem',
    marginTop: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }
};
