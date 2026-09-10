import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Package, Plus } from 'lucide-react';

const AdminInventory = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    productId: '',
    type: 'IN',
    quantity: '',
    reference: '',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInventory = async () => {
    try {
      const [invRes, prodRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/products?limit=100')
      ]);
      setMovements(invRes.data.data);
      setProducts(prodRes.data.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      await api.post('/inventory', formData);
      setShowForm(false);
      setFormData({ productId: '', type: 'IN', quantity: '', reference: '', notes: '' });
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'فشل إضافة حركة المخزون');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>جاري التحميل...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <Package size={28} />
          إدارة المخزون
        </h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} style={{ marginLeft: '0.5rem' }} />
          إضافة حركة
        </Button>
      </div>

      {showForm && (
        <div className="glass" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>إضافة حركة مخزون</h2>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>المنتج</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              >
                <option value="">اختر المنتج...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name_ar} / {p.name_en} (المخزون: {p.stock})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>نوع الحركة</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
              >
                <option value="IN">وارد (إضافة مخزون)</option>
                <option value="OUT">صادر (خصم مخزون)</option>
              </select>
            </div>

            <Input label="الكمية" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" />
            <Input label="المرجع (اختياري)" type="text" name="reference" value={formData.reference} onChange={handleChange} placeholder="مثال: فاتورة مورد #123" />
            <Input label="ملاحظات (اختياري)" type="text" name="notes" value={formData.notes} onChange={handleChange} />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" isLoading={formLoading}>حفظ الحركة</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem' }}>التاريخ</th>
              <th style={{ padding: '1rem' }}>المنتج</th>
              <th style={{ padding: '1rem' }}>نوع الحركة</th>
              <th style={{ padding: '1rem' }}>الكمية</th>
              <th style={{ padding: '1rem' }}>المرجع</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                  لا توجد حركات مخزون.
                </td>
              </tr>
            ) : (
              movements.map((mov) => (
                <tr key={mov.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(mov.createdAt).toLocaleString('ar-SA')}</td>
                  <td style={{ padding: '1rem' }}>{mov.product?.name_ar || mov.product?.name_en || 'غير معروف'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      backgroundColor: mov.type === 'IN' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: mov.type === 'IN' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {mov.type === 'IN' ? 'وارد' : 'صادر'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{mov.type === 'IN' ? '+' : '-'}{mov.quantity}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{mov.reference || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
