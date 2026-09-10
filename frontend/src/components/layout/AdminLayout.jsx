import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, LogOut, Home, FileText, Ticket, Archive } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: t('admin.dashboard') },
    { path: '/admin/products', icon: <Package size={20} />, label: t('admin.products') },
    { path: '/admin/categories', icon: <Tag size={20} />, label: t('admin.categories') },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: t('admin.orders') },
    { path: '/admin/prescriptions', icon: <FileText size={20} />, label: t('prescriptions.prescriptions') },
    { path: '/admin/coupons', icon: <Ticket size={20} />, label: t('coupons.coupons') },
    { path: '/admin/users', icon: <Users size={20} />, label: t('admin.user_management') },
    { path: '/admin/inventory', icon: <Archive size={20} />, label: 'Inventory' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="admin-brand">
          <span className="brand-icon">💊</span>
          <span>{t('admin.admin_panel')}</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-item">
            <Home size={20} />
            <span>{t('navbar.home')}</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item logout-btn">
            <LogOut size={20} />
            <span>{t('admin.sign_out')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header glass">
          <h2>{t('admin.admin_panel')}</h2>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
