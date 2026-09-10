import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update user role');
    }
  };

  const handleDelete = async (userId, email) => {
    if (email === 'admin_850419@alamal.com') {
      alert(t('admin.cannot_delete_master'));
      return;
    }
    
    if (!window.confirm(t('admin.confirm_delete_user'))) return;
    
    try {
      await api.delete(`/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete user');
    }
  };

  if (loading && users.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{t('admin.user_management')}</h1>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.name')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.email')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.role')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.joined_date')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {user.email}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.email === 'admin_850419@alamal.com'}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border)',
                      backgroundColor: user.role === 'admin' ? 'var(--primary-light)' : 'transparent',
                      color: user.role === 'admin' ? 'white' : 'inherit',
                      cursor: user.email === 'admin_850419@alamal.com' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="customer" style={{ color: 'black' }}>{t('admin.customer_role')}</option>
                    <option value="admin" style={{ color: 'black' }}>{t('admin.admin_role')}</option>
                  </select>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(user.id, user.email)} 
                    disabled={user.email === 'admin_850419@alamal.com'}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: user.email === 'admin_850419@alamal.com' ? 'not-allowed' : 'pointer', 
                      color: user.email === 'admin_850419@alamal.com' ? 'var(--text-muted)' : 'var(--danger)' 
                    }}
                    title={user.email === 'admin_850419@alamal.com' ? t('admin.cannot_delete_master') : t('admin.delete')}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_users_found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
