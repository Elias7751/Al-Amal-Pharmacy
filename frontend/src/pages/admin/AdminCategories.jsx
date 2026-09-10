import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminCategories = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete_category'))) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete category');
    }
  };

  if (loading && categories.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{t('admin.category_management')}</h1>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h3>{editingId ? t('admin.edit_category') : t('admin.add_new_category')}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginTop: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Input 
              label={t('admin.name')} 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div style={{ flex: 2 }}>
            <Input 
              label={t('admin.description')} 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>
          <Button type="submit" variant="primary" style={{ height: '42px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {editingId ? t('admin.update') : <><Plus size={18} /> {t('admin.add')}</>}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({name:'', description:''}); }} style={{ height: '42px' }}>
              {t('admin.cancel')}
            </Button>
          )}
        </form>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.id')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.name')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.description')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{cat.id}</td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>{cat.name}</td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>{cat.description || '-'}</td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '1rem' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_categories_found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
