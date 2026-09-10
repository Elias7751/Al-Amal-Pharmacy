import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [detailsForm, setDetailsForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDetailsChange = (e) => {
    setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitDetails = async (e) => {
    e.preventDefault();
    try {
      setDetailsLoading(true);
      setDetailsMsg('');
      const res = await api.put('/auth/update-details', detailsForm);
      updateUser(res.data.data.user);
      setDetailsMsg(t('profile.update_profile') + ' ✅');
    } catch (err) {
      setDetailsMsg(err.response?.data?.error?.message || 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setDetailsLoading(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    try {
      setPasswordLoading(true);
      setPasswordMsg('');
      const res = await api.put('/auth/update-password', passwordForm);
      // token is returned, update localStorage if we want, but AuthContext handles token in login not update.
      // actually, just updating token in localStorage is good.
      if (res.data.data.token) {
        localStorage.setItem('token', res.data.data.token);
      }
      setPasswordMsg(t('profile.change_password') + ' ✅');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg(err.response?.data?.error?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{t('profile.my_profile')}</h1>
      
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'var(--primary)',
            marginBottom: '1.5rem',
            border: '4px solid white',
            boxShadow: 'var(--shadow-md)'
          }}>
            {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>{user.firstName} {user.lastName}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{user.email}</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('profile.role')}</label>
              <div style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                {user.role === 'admin' ? t('admin.admin_role') : t('admin.customer_role')}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('profile.phone')}</label>
              <div style={{ fontWeight: '500' }}>{user.phone || t('profile.not_provided')}</div>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout} style={{ width: '100%', marginBottom: '1rem' }}>{t('navbar.logout')}</Button>
        </div>
        
        <div style={{ flex: '2 1 400px' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            {t('profile.update_profile')}
          </h3>
          <form onSubmit={submitDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {detailsMsg && <div style={{ color: detailsMsg.includes('✅') ? 'var(--success)' : 'var(--danger)' }}>{detailsMsg}</div>}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label={t('profile.first_name')} name="firstName" value={detailsForm.firstName} onChange={handleDetailsChange} required />
              <Input label={t('profile.last_name')} name="lastName" value={detailsForm.lastName} onChange={handleDetailsChange} required />
            </div>
            <Input label={t('profile.phone')} name="phone" value={detailsForm.phone} onChange={handleDetailsChange} />
            <Button type="submit" variant="primary" disabled={detailsLoading}>
              {detailsLoading ? '...' : t('profile.save_changes')}
            </Button>
          </form>

          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            {t('profile.change_password')}
          </h3>
          <form onSubmit={submitPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {passwordMsg && <div style={{ color: passwordMsg.includes('✅') ? 'var(--success)' : 'var(--danger)' }}>{passwordMsg}</div>}
            <Input label={t('profile.current_password')} type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
            <Input label={t('profile.new_password')} type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
            <Button type="submit" variant="primary" disabled={passwordLoading}>
              {passwordLoading ? '...' : t('profile.save_changes')}
            </Button>
          </form>
          
          <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>روابط سريعة</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => navigate('/orders')}>{t('profile.view_my_orders')}</Button>
            <Button variant="outline" onClick={() => navigate('/prescriptions')}>{t('prescriptions.my_prescriptions')}</Button>
            <Button variant="outline" onClick={() => navigate('/addresses')}>عناويني</Button>
            {user.role === 'admin' && (
              <Button variant="secondary" onClick={() => navigate('/admin')}>{t('profile.admin_dashboard')}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
