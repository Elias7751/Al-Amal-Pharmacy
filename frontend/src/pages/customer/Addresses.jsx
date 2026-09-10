import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ title: '', addressLine: '', city: '', isDefault: false });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      setAddresses(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/addresses', form);
      setFormVisible(false);
      setForm({ title: '', addressLine: '', city: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)' }}>عناويني</h1>
        <Button variant="primary" onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'إلغاء' : '+ إضافة عنوان جديد'}
        </Button>
      </div>

      {formVisible && (
        <form onSubmit={handleAdd} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="العنوان (مثال: المنزل، العمل)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input label="الشارع والمنطقة" value={form.addressLine} onChange={e => setForm({ ...form, addressLine: e.target.value })} required />
          <Input label="المدينة" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
            تعيين كعنوان افتراضي
          </label>
          <Button type="submit" variant="primary">حفظ العنوان</Button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center' }}>جاري التحميل...</div>
      ) : addresses.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-muted)' }}>ليس لديك عناوين محفوظة بعد.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map(addr => (
            <div key={addr.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: addr.isDefault ? '2px solid var(--primary)' : 'none' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {addr.title} {addr.isDefault && <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1rem' }}>افتراضي</span>}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{addr.addressLine}، {addr.city}</p>
              </div>
              <Button variant="outline" onClick={() => handleDelete(addr.id)} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>حذف</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;