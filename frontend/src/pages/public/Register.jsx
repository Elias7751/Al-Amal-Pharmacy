import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      const { user, token } = response.data.data;
      login(user, token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'فشل إنشاء الحساب. يرجى التحقق من البيانات المدخلة.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>إنشاء حساب جديد</h1>
          <p style={{ color: 'var(--text-muted)' }}>انضم إلى صيدلية الأمل اليوم</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input 
              label="الاسم الأول"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
            <Input 
              label="الاسم الأخير"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
          </div>

          <Input 
            label="البريد الإلكتروني"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input 
            label="رقم الهاتف (اختياري)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <Input 
            label="كلمة المرور"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            style={{ width: '100%', marginTop: '1rem' }}
            isLoading={loading}
          >
            إنشاء الحساب
          </Button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          لديك حساب بالفعل؟ <Link to="/login" style={{ fontWeight: '600' }}>سجّل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
