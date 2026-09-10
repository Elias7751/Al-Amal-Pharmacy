import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { CartContext } from '../../contexts/CartContext';
import { AuthContext } from '../../contexts/AuthContext';
import { WishlistContext } from '../../contexts/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) return navigate('/login');
    setWishlistLoading(true);
    await toggleWishlist(product.id);
    setWishlistLoading(false);
  };

  const isLiked = isInWishlist(product.id);

  return (
    <div className="glass" style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button 
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            color: isLiked ? 'red' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
          title="Toggle Wishlist"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-main)' }}>{product.name}</h3>
          <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.125rem' }}>
            ${parseFloat(product.price).toFixed(2)}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/product/${product.id}`} style={{ flex: 1 }}>
            <Button variant="outline" size="sm" style={{ width: '100%' }}>View Details</Button>
          </Link>
          <Button 
            variant="primary" 
            size="sm" 
            style={{ flex: 1 }} 
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            isLoading={loading}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
