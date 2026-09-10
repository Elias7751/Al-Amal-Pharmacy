import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error(error);
        toast.error("حدث خطأ أثناء تحميل تفاصيل المنتج");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/${id}`);
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("المنتج غير متوفر حالياً");
      return;
    }
    addToCart(product.id, quantity);
    toast.success("تم إضافة المنتج للسلة");
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.info("يرجى تسجيل الدخول أولاً");
      return;
    }
    try {
      const { data } = await api.post('/wishlist', { product_id: product.id });
      if (data.success) {
        toast.success("تم إضافة المنتج للمفضلة");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '5rem' }}>المنتج غير موجود</div>;
  }

  return (
    <div>
      <div className="card" style={styles.container}>
        <div style={styles.imageSection}>
          <img 
            src={product.image ? `http://localhost:5000${product.image}` : 'https://placehold.co/600x600/E5E7EB/A1A1AA?text=No+Image'} 
            alt={product.name_ar} 
            style={styles.image}
          />
        </div>
        
        <div style={styles.infoSection}>
          <h1 style={styles.title}>{product.name_ar}</h1>
          {product.name_en && <h2 style={styles.subtitle}>{product.name_en}</h2>}
          
          <div style={styles.priceRow}>
            <span style={styles.price}>{product.price} ريال</span>
            {product.stock > 0 ? (
              <span style={styles.stockStatus}>
                <FaCheckCircle color="var(--success)" /> متوفر ({product.stock} حبة)
              </span>
            ) : (
              <span style={styles.stockStatus}>
                <FaExclamationCircle color="var(--danger)" /> غير متوفر
              </span>
            )}
          </div>

          <p style={styles.description}>{product.description_ar}</p>
          {product.description_en && <p style={styles.descriptionEn}>{product.description_en}</p>}

          <div style={styles.actionSection}>
            <div style={styles.quantityWrapper}>
              <button 
                style={styles.qtyBtn} 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
              >-</button>
              <input 
                type="number" 
                value={quantity} 
                readOnly 
                style={styles.qtyInput} 
              />
              <button 
                style={styles.qtyBtn} 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={product.stock === 0}
              >+</button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FaShoppingCart /> أضف للسلة
              </button>
              <button 
                className="btn btn-outline" 
                onClick={handleAddToWishlist}
              >
                <FaHeart color="var(--danger)" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <h3 style={styles.reviewsTitle}>تقييمات العملاء</h3>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>لا توجد تقييمات لهذا المنتج بعد.</p>
        ) : (
          <div className="grid grid-cols-2">
            {reviews.map(review => (
              <div key={review.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold' }}>{review.customer_name}</h4>
                  <div style={{ color: '#FBBF24', display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} color={i < review.rating ? '#FBBF24' : '#E5E7EB'} />
                    ))}
                  </div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: '3rem',
    padding: '3rem',
    marginBottom: '3rem'
  },
  imageSection: {
    flex: '0 0 400px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6'
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-muted)',
    fontWeight: 'normal',
    marginBottom: '1.5rem'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--border)'
  },
  price: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--primary)'
  },
  stockStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '1.125rem'
  },
  description: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    marginBottom: '1rem'
  },
  descriptionEn: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    marginBottom: '2rem',
    direction: 'ltr',
    textAlign: 'left'
  },
  actionSection: {
    marginTop: 'auto',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    backgroundColor: 'var(--background)',
    padding: '1.5rem',
    borderRadius: 'var(--radius-lg)'
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
    padding: '0.75rem 1rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: 'var(--surface-hover)',
    color: 'var(--text-main)'
  },
  qtyInput: {
    width: '50px',
    textAlign: 'center',
    border: 'none',
    borderLeft: '1px solid var(--border)',
    borderRight: '1px solid var(--border)',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    padding: '0.75rem 0'
  },
  reviewsSection: {
    marginTop: '3rem'
  },
  reviewsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    borderBottom: '2px solid var(--primary)',
    display: 'inline-block',
    paddingBottom: '0.5rem'
  }
};

// Add media queries for responsive design
const mediaStyles = `
@media (max-width: 768px) {
  .card[style*="flex-direction: row"] {
    flex-direction: column !important;
    padding: 1.5rem !important;
  }
  .card > div[style*="flex: 0 0 400px"] {
    flex: 1 !important;
    width: 100% !important;
  }
}
`;

// Inject media queries safely
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = mediaStyles;
  document.head.appendChild(styleSheet);
}
