import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    requiresPrescription: false,
    images: [''] // Simple array with one image URL for now
  };
  
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, images: [value] });
    } else {
      setFormData({ 
        ...formData, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploading(true);
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, images: [res.data.data.url] });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, dataToSubmit);
      } else {
        await api.post('/products', dataToSubmit);
      }
      
      setFormData(initialForm);
      setEditingId(null);
      setIsFormVisible(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '',
      requiresPrescription: product.requiresPrescription || false,
      images: product.images || ['']
    });
    setEditingId(product.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirm_delete_product'))) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete product');
    }
  };

  if (loading && products.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>{t('admin.product_management')}</h1>
        <Button 
          variant="primary" 
          onClick={() => { setIsFormVisible(!isFormVisible); setEditingId(null); setFormData(initialForm); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isFormVisible ? t('admin.cancel') : <><Plus size={18} /> {t('admin.add_new_product')}</>}
        </Button>
      </div>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      {isFormVisible && (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? t('admin.edit_product') : t('admin.add_new_product')}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Input label={t('admin.product_name')} name="name" value={formData.name} onChange={handleChange} required />
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>{t('admin.category')}</label>
                <select 
                  name="categoryId" 
                  value={formData.categoryId} 
                  onChange={handleChange} 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                >
                  <option value="">{t('admin.select_category')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <Input label={t('admin.price')} type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
              <Input label={t('admin.stock')} type="number" name="stock" value={formData.stock} onChange={handleChange} required />
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-main)' }}>{t('admin.image')}</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                  />
                  {uploading && <span style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>{t('admin.uploading')}</span>}
                </div>
                {formData.images[0] && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={formData.images[0]} alt="Preview" style={{ height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    name="requiresPrescription" 
                    checked={formData.requiresPrescription} 
                    onChange={handleChange} 
                    style={{ width: '1.2rem', height: '1.2rem' }}
                  />
                  <span>{t('admin.requires_prescription')}</span>
                </label>
              </div>
            </div>
            
            <Input label={t('admin.description')} name="description" value={formData.description} onChange={handleChange} />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary">
                {editingId ? t('admin.update_product') : t('admin.save_product')}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.product')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.category')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.price')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.stock')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id}>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={prod.images?.[0] || 'https://via.placeholder.com/40'} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontWeight: '500' }}>{prod.name}</div>
                      {prod.requiresPrescription && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 'bold' }}>{t('admin.rx_required')}</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {prod.category?.name || t('admin.uncategorized')}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>
                  ${parseFloat(prod.price).toFixed(2)}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: prod.stock > 10 ? 'var(--success)' : prod.stock > 0 ? 'orange' : 'var(--danger)' }}>
                    {prod.stock}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <button onClick={() => handleEdit(prod)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '1rem' }}>
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(prod.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('admin.no_products_found')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
