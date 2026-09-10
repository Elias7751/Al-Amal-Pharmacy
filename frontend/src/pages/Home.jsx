import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPrescriptionBottleAlt, FaHeartbeat, FaBaby, FaVials, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Just fetching some products for the homepage
        const { data } = await api.get('/products?limit=4');
        if (data.success) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>صحتك وعافيتك في مكان واحد</h1>
          <p style={styles.heroText}>
            أفضل المنتجات الطبية، الأدوية الموثوقة، ومستحضرات العناية بأسعار تنافسية وتوصيل سريع لباب بيتك.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/shop" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              تسوق الآن
            </Link>
            <Link to="/shop?category=offers" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              عروض اليوم
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>تسوق حسب القسم</h2>
        </div>
        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.id}`} key={cat.id} style={styles.categoryCard}>
              <div style={styles.catIconWrapper}>{cat.icon}</div>
              <h3 style={styles.catTitle}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>وصل حديثاً</h2>
          <Link to="/shop" style={styles.viewAll}>
            عرض الكل <FaArrowLeft size={12} />
          </Link>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card" style={styles.productCard}>
                <div style={styles.imageContainer}>
                  <img 
                    src={product.image ? `http://localhost:5000${product.image}` : 'https://placehold.co/400x400/E5E7EB/A1A1AA?text=No+Image'} 
                    alt={product.name_ar} 
                    style={styles.productImage} 
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <span style={styles.badgeWarning}>باقي {product.stock} فقط</span>
                  )}
                </div>
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name_ar}</h3>
                  <p style={styles.productPrice}>{product.price} ريال</p>
                  <Link to={`/product/${product.id}`} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                    التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Banner */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>خصم 20% على أول طلب!</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
            استخدم الكود <strong>WELCOME20</strong> عند إتمام الطلب واستمتع بخصم فوري على جميع مشترياتك.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
            سجل الآن
          </Link>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { id: 1, name: 'الأدوية الوصفية', icon: <FaPrescriptionBottleAlt size={32} /> },
  { id: 2, name: 'الفيتامينات والمكملات', icon: <FaHeartbeat size={32} /> },
  { id: 3, name: 'العناية بالطفل', icon: <FaBaby size={32} /> },
  { id: 4, name: 'المعدات الطبية', icon: <FaVials size={32} /> },
];

const styles = {
  hero: {
    backgroundColor: 'var(--primary-light)',
    borderRadius: 'var(--radius-xl)',
    padding: '4rem 2rem',
    textAlign: 'center',
    marginBottom: '4rem',
    backgroundImage: 'linear-gradient(135deg, var(--primary-light) 0%, #E0F2FE 100%)'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '900',
    color: 'var(--primary-dark)',
    marginBottom: '1.5rem',
    lineHeight: 1.2
  },
  heroText: {
    fontSize: '1.25rem',
    color: 'var(--text-main)',
    marginBottom: '2.5rem'
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  section: {
    marginBottom: '5rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    position: 'relative',
    paddingRight: '1rem',
    borderRight: '4px solid var(--primary)'
  },
  viewAll: {
    color: 'var(--primary)',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'color 0.2s'
  },
  categoryCard: {
    backgroundColor: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    textAlign: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  catIconWrapper: {
    color: 'var(--primary)',
    backgroundColor: 'var(--primary-light)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  catTitle: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  imageContainer: {
    position: 'relative',
    paddingTop: '100%', // 1:1 aspect ratio
    backgroundColor: '#F3F4F6'
  },
  productImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  badgeWarning: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: 'var(--warning)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-xl)',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  productInfo: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  productName: {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: 'var(--text-main)'
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--primary)',
    marginTop: 'auto'
  },
  banner: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    borderRadius: 'var(--radius-xl)',
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
  },
  bannerContent: {
    maxWidth: '600px',
    margin: '0 auto'
  }
};
