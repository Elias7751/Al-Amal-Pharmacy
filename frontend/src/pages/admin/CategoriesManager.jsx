import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('حدث خطأ أثناء جلب التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error('يرجى إدخال اسم التصنيف');
    }

    try {
      if (isEditing) {
        const { data } = await api.put(`/categories/${formData.id}`, {
          name: formData.name,
          description: formData.description
        });
        if (data.success) {
          toast.success('تم تحديث التصنيف بنجاح');
        }
      } else {
        const { data } = await api.post('/categories', {
          name: formData.name,
          description: formData.description
        });
        if (data.success) {
          toast.success('تمت إضافة التصنيف بنجاح');
        }
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التصنيف؟ قد يتسبب ذلك في مشاكل إذا كان هناك منتجات مرتبطة به.')) {
      try {
        const { data } = await api.delete(`/categories/${id}`);
        if (data.success) {
          toast.success('تم حذف التصنيف بنجاح');
          fetchCategories();
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء الحذف');
      }
    }
  };

  if (loading) return <div className="spinner" style={{ margin: 'auto' }}></div>;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>إدارة التصنيفات</h2>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPlus /> إضافة تصنيف
        </button>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>الاسم</th>
              <th>الوصف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td style={{ fontWeight: 'bold' }}>{category.name}</td>
                <td>{category.description || '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      style={styles.actionBtn}
                      onClick={() => openEditModal(category)}
                      title="تعديل"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={styles.actionBtn}
                      onClick={() => handleDelete(category.id)}
                      title="حذف"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>لا توجد تصنيفات بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{isEditing ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>اسم التصنيف *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>الوصف</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>حفظ</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1rem'
  },
  actionBtn: {
    padding: '0.4rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'var(--surface)',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  }
};
