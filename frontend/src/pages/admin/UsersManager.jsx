import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserShield, FaUser } from 'react-icons/fa';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('حدث خطأ أثناء جلب العملاء');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      toast.error('لا يمكن حذف حساب مدير!');
      return;
    }
    
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم نهائياً؟')) {
      try {
        const { data } = await api.delete(`/users/${id}`);
        if (data.success) {
          toast.success('تم حذف المستخدم بنجاح');
          fetchUsers();
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
        <h2 style={{ margin: 0 }}>إدارة العملاء والمستخدمين</h2>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>الاسم</th>
              <th>رقم الجوال</th>
              <th>البريد الإلكتروني</th>
              <th>النوع</th>
              <th>تاريخ التسجيل</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td style={{ direction: 'ltr', textAlign: 'right' }}>{user.phone}</td>
                <td>{user.email || '—'}</td>
                <td>
                  <span style={user.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                    {user.role === 'admin' ? <><FaUserShield /> مدير</> : <><FaUser /> عميل</>}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('ar-SA')}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={styles.actionBtn}
                    onClick={() => handleDelete(user.id, user.role)}
                    disabled={user.role === 'admin'}
                    title="حذف المستخدم"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>لا يوجد مستخدمين مسجلين بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
  adminBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: '#8b5cf6',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  userBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'var(--border)',
    color: 'var(--text-main)',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  }
};
