import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaLock } from 'react-icons/fa';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { phone, password });
      if (data.success) {
        login(data.user, data.token);
        toast.success("تم تسجيل الدخول بنجاح");
        if (data.user.role === 'admin') {
          window.location.href = '/admin';
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "رقم الهاتف أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>تسجيل الدخول</h1>
          <p style={styles.subtitle}>أهلاً بك مجدداً في صيدلية الأمل</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">رقم الهاتف</label>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.inputIcon} />
              <input 
                type="text" 
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                className="form-control" 
                style={styles.inputWithIcon}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'تسجيل الدخول'}
          </button>
        </form>

        <p style={styles.footer}>
          ليس لديك حساب؟ <Link to="/register" style={styles.link}>سجل الآن</Link>
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
    minHeight: '60vh',
    padding: '2rem 0'
  },
  card: {
    width: '100%',
    maxWidth: '450px',
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
