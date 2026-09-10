import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { CartContext } from '../../contexts/CartContext';
import { ShoppingCart, User, LogOut, Heart, Globe } from 'lucide-react';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💊</span>
          صيدلية الأمل
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">{t('navbar.home')}</Link>
          <Link to="/shop" className="nav-link">{t('navbar.shop')}</Link>
        </div>

        <div className="navbar-actions">
          <button onClick={toggleLanguage} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '1rem', fontWeight: '500' }}>
            <Globe size={18} />
            {i18n.language === 'ar' ? 'EN' : 'عربي'}
          </button>
          <Link to="/wishlist" className="cart-icon-wrapper" title={t('navbar.wishlist')}>
            <Heart size={24} />
          </Link>
          <Link to="/cart" className="cart-icon-wrapper">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">مرحباً، {user.firstName || user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">لوحة الإدارة</Link>
              )}
              <Link to="/profile" className="nav-link"><User size={20}/></Link>
              <button onClick={handleLogout} className="logout-btn" title="تسجيل الخروج">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <Button variant="outline" size="md">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">حساب جديد</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
