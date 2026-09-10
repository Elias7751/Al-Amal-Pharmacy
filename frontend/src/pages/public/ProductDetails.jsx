import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState('');
  
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setAddingToCart(false);
    }
  };

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`).catch(() => ({ data: { data: [] } }))
      ]);
      setProduct(productRes.data.data);
      setReviews(reviewsRes.data.data || []);
    } catch (err) {
      setError('Product not found.');
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    setReviewMsg('');
    try {
      await api.post('/reviews', {
        productId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewMsg(t('reviews.success_submitting') + ' ✅');
      setReviewForm({ rating: 5, comment: '' });
      // Refresh reviews
      const reviewsRes = await api.get(`/reviews/product/${id}`);
      setReviews(reviewsRes.data.data || []);
    } catch (err) {
      setReviewMsg(err.response?.data?.error?.message || t('reviews.error_submitting'));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Product not found'}</h2>
        <Button variant="primary" onClick={() => navigate('/shop')}>Back to Shop</Button>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', padding: '2rem 1rem' }}>
      
      {/* Product Details Section */}
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img src={imageUrl} alt={product.name} style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
        
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{product.name}</h1>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
            ${parseFloat(product.price).toFixed(2)}
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
          
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', flex: 1 }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Stock Status</div>
              <div style={{ fontWeight: '500', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', flex: 1 }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Category</div>
              <div style={{ fontWeight: '500' }}>{product.category?.name || 'General'}</div>
            </div>
          </div>

          <Button 
            variant="primary" 
            size="lg" 
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            isLoading={addingToCart}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{t('reviews.reviews')}</h2>
        
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {/* List of Reviews */}
          <div style={{ flex: '2 1 400px' }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>{t('reviews.no_reviews')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map(review => (
                  <div key={review.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--primary)' }}>{review.user?.firstName} {review.user?.lastName}</strong>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>★ {review.rating}/5</span>
                    </div>
                    <p style={{ color: 'var(--text-main)' }}>{review.comment}</p>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div style={{ flex: '1 1 300px' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>{t('reviews.add_review')}</h3>
              {!user ? (
                <p style={{ color: 'var(--text-muted)' }}>
                  <Button variant="outline" onClick={() => navigate('/login')} style={{ width: '100%' }}>
                    {t('reviews.login_to_review')}
                  </Button>
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviewMsg && <div style={{ color: reviewMsg.includes('✅') ? 'var(--success)' : 'var(--danger)' }}>{reviewMsg}</div>}
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('reviews.rating')}</label>
                    <select 
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--background)' 
                      }}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('reviews.comment')}</label>
                    <textarea 
                      required
                      rows="4"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--background)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <Button type="submit" variant="primary" disabled={submittingReview}>
                    {submittingReview ? t('reviews.submitting') : t('reviews.submit_review')}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
