import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaPhone, FaEnvelope } from 'react-icons/fa';
import api from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });
      if (data.success) {
        toast.success("تم التسجيل بنجاح! يرجى تسجيل الدخول.");
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التسجيل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>إنشاء حساب جديد</h1>
          <p style={styles.subtitle}>انضم إلينا واستمتع بتجربة تسوق مميزة</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input 
                type="text" 
                name="name"
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="أحمد محمد"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <div style={styles.inputWrapper}>
              <FaPhone style={styles.inputIcon} />
              <input 
                type="text" 
                name="phone"
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="05xxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input 
                type="email" 
                name="email"
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input 
                type="password" 
                name="password"
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input 
                type="password" 
                name="confirmPassword"
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'تسجيل حساب جديد'}
          </button>
        </form>

        <p style={styles.footer}>
          لديك حساب بالفعل؟ <Link to="/login" style={styles.link}>تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '2rem 0'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    padding: '3rem 2rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--primary-dark)',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: 'var(--text-muted)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    right: '1rem',
    color: 'var(--text-muted)'
  },
  inputWithIcon: {
    paddingRight: '2.5rem'
  },
  submitBtn: {
    width: '100%',
    padding: '0.875rem',
    fontSize: '1.125rem',
    marginTop: '1rem'
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    color: 'var(--text-muted)'
  },
  link: {
    color: 'var(--primary)',
    fontWeight: 'bold',
    transition: 'color 0.2s'
  }
};
