import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Tag } from 'lucide-react';

const AdminCoupons = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMsg('');

    try {
      await api.post('/coupons', {
        code,
        discountPercentage: parseInt(discountPercentage),
        expirationDate
      });
      setMsg(t('coupons.success_create') + ' ✅');
      setCode('');
      setDiscountPercentage('');
      setExpirationDate('');
      fetchCoupons();
    } catch (err) {
      setMsg(err.response?.data?.error?.message || err.message || 'Error creating coupon');
    } finally {
      setCreating(false);
    }
  };

  if (loading && coupons.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{t('coupons.coupons')}</h1>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={20} />
          {t('coupons.add_coupon')}
        </h3>
        
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            {msg && <div style={{ color: msg.includes('✅') ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }}>{msg}</div>}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{t('coupons.coupon_code')}</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{t('coupons.discount_percentage')}</label>
            <input 
              type="number" 
              min="1" 
              max="100"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="20"
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>{t('coupons.expiration_date')}</label>
            <input 
              type="date" 
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', backgroundColor: 'var(--background)' }}
            />
          </div>

          <div>
            <Button type="submit" variant="primary" disabled={creating} style={{ width: '100%' }}>
              {creating ? t('coupons.creating') : t('coupons.add_coupon')}
            </Button>
          </div>
        </form>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('coupons.coupon_code')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('coupons.discount_percentage')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('coupons.expiration_date')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => {
              const isExpired = new Date(coupon.expirationDate) < new Date();
              return (
                <tr key={coupon.id}>
                  <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {coupon.code}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    {coupon.discountPercentage}%
                  </td>
                  <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: isExpired ? 'var(--danger)' : 'inherit' }}>
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    {isExpired ? (
                      <span style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 'bold' }}>Expired</span>
                    ) : coupon.isActive ? (
                      <span style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 'bold' }}>Active</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 'bold' }}>Inactive</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('coupons.no_coupons')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
