import React from 'react';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '4rem 2rem',
        backgroundColor: 'var(--primary-light)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '4rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            {t('home.hero_title')}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {t('home.hero_desc')}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/shop">
              <Button variant="primary" size="lg">{t('home.shop_now')}</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg">{t('home.create_account')}</Button>
            </Link>
          </div>
        </div>
        <div style={{ fontSize: '10rem', color: 'var(--primary)', opacity: 0.8 }}>
          💊
        </div>
      </section>

      {/* Features Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t('home.why_choose_us')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { title: t('home.fast_delivery'), desc: t('home.fast_delivery_desc') },
            { title: t('home.certified_pharmacists'), desc: t('home.certified_pharmacists_desc') },
            { title: t('home.support'), desc: t('home.support_desc') },
            { title: t('home.secure_payments'), desc: t('home.secure_payments_desc') },
          ].map((feature, idx) => (
            <div key={idx} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>✨</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
