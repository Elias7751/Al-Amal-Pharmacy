import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaTags } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    valid_until: '',
    max_uses: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('حدث خطأ أثناء جلب الكوبونات');
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
    if (!formData.code || !formData.discount_percentage) {
      return toast.error('يرجى إدخال الكود ونسبة الخصم');
    }

    try {
      const { data } = await api.post('/coupons', {
        code: formData.code.toUpperCase(),
        discount_percentage: parseFloat(formData.discount_percentage),
        valid_until: formData.valid_until || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
      });
      
      if (data.success) {
        toast.success('تمت إضافة الكوبون بنجاح');
        setShowModal(false);
        fetchCoupons();
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('حدث خطأ أثناء الحفظ');
      }
    }
  };

  const openAddModal = () => {
    setFormData({ code: '', discount_percentage: '', valid_until: '', max_uses: '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
      try {
        const { data } = await api.delete(`/coupons/${id}`);
        if (data.success) {
          toast.success('تم حذف الكوبون بنجاح');
          fetchCoupons();
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
        <h2 style={{ margin: 0 }}>إدارة الكوبونات والخصومات</h2>
        <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPlus /> إضافة كوبون
        </button>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>كود الخصم</th>
              <th>النسبة المئوية (%)</th>
              <th>الاستخدامات (الحالي / الأقصى)</th>
              <th>تاريخ الانتهاء</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => {
              const isExpired = coupon.valid_until && new Date(coupon.valid_until) < new Date();
              const isUsedUp = coupon.max_uses && coupon.current_uses >= coupon.max_uses;
              
              return (
                <tr key={coupon.id} style={{ opacity: (isExpired || isUsedUp) ? 0.6 : 1 }}>
                  <td>{coupon.id}</td>
                  <td>
                    <span style={styles.couponBadge}>
                      <FaTags style={{ fontSize: '0.75rem' }} /> {coupon.code}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold', color: 'var(--success)' }}>{coupon.discount_percentage}%</td>
                  <td>{coupon.current_uses} / {coupon.max_uses || 'بلا حدود'}</td>
                  <td>
                    {coupon.valid_until 
                      ? new Date(coupon.valid_until).toLocaleDateString('ar-SA')
                      : 'لا يوجد'}
                    {isExpired && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginRight: '0.5rem' }}>(منتهي)</span>}
                  </td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      style={styles.actionBtn}
                      onClick={() => handleDelete(coupon.id)}
                      title="حذف"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>لا توجد كوبونات مسجلة.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>إضافة كود خصم جديد</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>كود الخصم (أحرف إنجليزية وأرقام) *</label>
                <input
                  type="text"
                  name="code"
                  className="form-control"
                  value={formData.code}
                  onChange={handleInputChange}
                  style={{ textTransform: 'uppercase', direction: 'ltr' }}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>نسبة الخصم (%) *</label>
                <input
                  type="number"
                  name="discount_percentage"
                  className="form-control"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>تاريخ الانتهاء (اختياري)</label>
                <input
                  type="date"
                  name="valid_until"
                  className="form-control"
                  value={formData.valid_until}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>الحد الأقصى لعدد الاستخدامات (اختياري)</label>
                <input
                  type="number"
                  name="max_uses"
                  className="form-control"
                  min="1"
                  value={formData.max_uses}
                  onChange={handleInputChange}
                  placeholder="اتركه فارغاً لعدد لا محدود"
                />
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
  couponBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--surface)',
    border: '1px dashed var(--primary)',
    color: 'var(--primary)',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontWeight: 'bold',
    letterSpacing: '1px'
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
