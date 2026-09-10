import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      if (data.success) {
        toast.success("تم إزالة المنتج من المفضلة");
        fetchWishlist();
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإزالة");
    }
  };

  const handleMoveToCart = async (productId) => {
    addToCart(productId, 1);
    handleRemove(productId);
    toast.success("تم نقل المنتج للسلة");
  };

  if (!user) {
    return (
      <div style={styles.emptyState}>
        <h2>يرجى تسجيل الدخول لعرض المفضلة</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>تسجيل الدخول</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="spinner" style={{ margin: '5rem auto' }}></div>;
  }

  if (wishlist.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2 style={{ marginBottom: '1rem' }}>قائمة المفضلة فارغة</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>لم تقم بإضافة أي منتجات للمفضلة بعد.</p>
        <Link to="/shop" className="btn btn-primary">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.title}>قائمة المفضلة</h1>
      <div className="grid grid-cols-4">
        {wishlist.map((item) => (
          <div key={item.product_id} className="card" style={styles.card}>
            <div style={styles.imageContainer}>
              <img 
                src={item.image ? `http://localhost:5000${item.image}` : 'https://placehold.co/400x400/E5E7EB/A1A1AA?text=No+Image'} 
                alt={item.name_ar} 
                style={styles.image} 
              />
              <button 
                style={styles.removeBtn}
                onClick={() => handleRemove(item.product_id)}
                title="إزالة من المفضلة"
              >
                <FaTrash />
              </button>
            </div>
            <div style={styles.info}>
              <h3 style={styles.name}>{item.name_ar}</h3>
              <p style={styles.price}>{item.price} ريال</p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => handleMoveToCart(item.product_id)}
                disabled={item.stock === 0}
              >
                <FaShoppingCart /> {item.stock === 0 ? 'نفذت الكمية' : 'أضف للسلة'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  emptyState: {
    textAlign: 'center',
    padding: '5rem 0'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%',
    backgroundColor: '#F3F4F6'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  removeBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: 'var(--danger)',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s'
  },
  info: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary)',
    marginTop: 'auto'
  }
};
