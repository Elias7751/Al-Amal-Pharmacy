import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaHeart, FaSearch, FaBars } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <div style={styles.logoGroup}>
          <button style={styles.menuButton} className="mobile-only">
            <FaBars size={24} color="var(--primary)" />
          </button>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>+</span>
            صيدلية الأمل
          </Link>
        </div>

        <div style={styles.searchContainer} className="desktop-only">
          <input 
            type="text" 
            placeholder="ابحث عن دواء، مستلزمات طبية..." 
            style={styles.searchInput}
          />
          <button style={styles.searchButton}>
            <FaSearch />
          </button>
        </div>

        <div style={styles.navLinks}>
          <Link to="/shop" style={styles.link}>المتجر</Link>
          
          <Link to="/wishlist" style={styles.iconLink}>
            <FaHeart size={20} />
          </Link>
          
          <Link to="/cart" style={styles.cartLink}>
            <FaShoppingCart size={20} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {user ? (
            <div style={styles.userMenu}>
              <Link to="/profile" style={styles.iconLink}>
                <FaUser size={20} />
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                تسجيل خروج
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  menuButton: {
    display: 'none', // Handle in CSS media queries
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--primary-dark)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    letterSpacing: '-0.025em'
  },
  logoIcon: {
    backgroundColor: 'var(--primary)',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem'
  },
  searchContainer: {
    flex: 1,
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--background)',
    fontSize: '0.9rem'
  },
  searchButton: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    fontWeight: '600',
    color: 'var(--text-main)',
    transition: 'color 0.2s'
  },
  iconLink: {
    color: 'var(--text-muted)',
    transition: 'color 0.2s',
    display: 'flex',
    alignItems: 'center'
  },
  cartLink: {
    position: 'relative',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center'
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--danger)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }
};
