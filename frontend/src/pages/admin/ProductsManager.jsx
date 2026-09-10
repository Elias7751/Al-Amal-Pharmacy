import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    category_id: 1,
    price: '',
    stock: '',
    image: '',
    description: '',
    is_prescription: false
  });

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100'); // Fetch more for admin
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name_ar: '', name_en: '', category_id: 1, price: '', stock: '', image: '', description: '', is_prescription: false
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name_ar: product.name_ar,
      name_en: product.name_en || '',
      category_id: product.category_id,
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      description: product.description || '',
      is_prescription: product.is_prescription === 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await api.put(`/products/${editingId}`, formData);
        if (data.success) toast.success('تم التحديث بنجاح');
      } else {
        const { data } = await api.post('/products', formData);
        if (data.success) toast.success('تمت الإضافة بنجاح');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      const { data } = await api.delete(`/products/${id}`);
      if (data.success) {
        toast.success('تم الحذف بنجاح');
        fetchProducts();
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '3rem auto' }}></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>إدارة المنتجات</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus /> إضافة منتج
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>الصورة</th>
              <th>الاسم (عربي)</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>وصفة طبية؟</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img 
                    src={p.image && p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`} 
                    alt={p.name_ar} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => e.target.src = 'https://placehold.co/50x50?text=No+Img'}
                  />
                </td>
                <td>{p.name_ar}</td>
                <td>{p.price} ريال</td>
                <td>
                  <span style={{ color: p.stock < 5 ? 'var(--danger)' : 'inherit', fontWeight: p.stock < 5 ? 'bold' : 'normal' }}>
                    {p.stock}
                  </span>
                </td>
                <td>{p.is_prescription ? 'نعم' : 'لا'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => openEditModal(p)}>
                      <FaEdit />
                    </button>
                    <button className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--danger)', color: 'white' }} onClick={() => handleDelete(p.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">الاسم (عربي) *</label>
                  <input type="text" className="form-control" name="name_ar" value={formData.name_ar} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">الاسم (انجليزي)</label>
                  <input type="text" className="form-control" name="name_en" value={formData.name_en} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">السعر *</label>
                  <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">المخزون *</label>
                  <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">القسم *</label>
                  <select className="form-control" name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                    <option value={1}>أدوية</option>
                    <option value={2}>مكملات غذائية</option>
                    <option value={3}>عناية شخصية</option>
                    <option value={4}>أجهزة طبية</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">رابط الصورة (URL)</label>
                <input type="text" className="form-control" name="image" value={formData.image} onChange={handleInputChange} />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">الوصف</label>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows={3}></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="is_prescription" name="is_prescription" checked={formData.is_prescription} onChange={handleInputChange} />
                <label htmlFor="is_prescription" style={{ fontWeight: 'bold' }}>يتطلب وصفة طبية؟</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'تحديث' : 'إضافة'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'right'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'var(--surface)',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
};
