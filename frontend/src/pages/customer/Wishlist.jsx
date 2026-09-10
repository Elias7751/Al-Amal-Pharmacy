import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../contexts/WishlistContext';
import ProductCard from '../../components/product/ProductCard';
import api from '../../services/api';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      setProducts(res.data.data.map(item => item.product));
    } catch (err) {
      setError('حدث خطأ في تحميل المفضلة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>
        المفضلة ({products.length})
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>جاري التحميل...</div>
      ) : error ? (
        <div style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</div>
      ) : products.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>قائمة مفضلتك فارغة</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            ابدأ بإضافة المنتجات التي تعجبك بالضغط على أيقونة القلب ❤️
          </p>
          <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>
            تصفح المتجر
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;