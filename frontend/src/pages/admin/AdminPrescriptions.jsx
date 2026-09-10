import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const AdminPrescriptions = () => {
  const { t } = useTranslation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/prescriptions'); 
      setPrescriptions(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedPrescription) return;

    setUpdating(true);
    try {
      await api.put(`/prescriptions/${selectedPrescription.id}/status`, {
        status,
        adminNotes
      });
      setSelectedPrescription(null);
      fetchPrescriptions();
    } catch (err) {
      alert('Failed to update prescription');
    } finally {
      setUpdating(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  if (loading && prescriptions.length === 0) return <Loader fullScreen />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>{t('prescriptions.prescriptions')}</h1>
      
      {error && <div style={{ color: 'white', backgroundColor: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}
      
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>ID</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('admin.customer')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('prescriptions.image')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('prescriptions.date')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>{t('prescriptions.status')}</th>
              <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', fontWeight: '500' }}>
                  {p.id.substring(0,8)}...
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div>{p.user?.firstName} {p.user?.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.user?.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.user?.phone}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <a href={getImageUrl(p.image)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    View Image
                  </a>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    backgroundColor: p.status === 'Approved' || p.status === 'Converted' ? 'var(--success)' : 
                                     p.status === 'Rejected' ? 'var(--danger)' : 'var(--primary-light)',
                    color: p.status === 'Pending' ? 'var(--primary)' : 'white'
                  }}>
                    {t(`prescriptions.${p.status.toLowerCase()}`)}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedPrescription(p);
                      setStatus(p.status);
                      setAdminNotes(p.adminNotes || '');
                    }}
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('prescriptions.no_prescriptions')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedPrescription && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass" style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: 'var(--radius-lg)', 
            width: '100%', 
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'var(--primary)' }}>Review Prescription</h2>
              <button 
                onClick={() => setSelectedPrescription(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ flex: '1 1 200px' }}>
                <img 
                  src={getImageUrl(selectedPrescription.image)} 
                  alt="Prescription" 
                  style={{ width: '100%', borderRadius: 'var(--radius-md)' }} 
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <p><strong>{t('admin.customer')}:</strong> {selectedPrescription.user?.firstName} {selectedPrescription.user?.lastName}</p>
                {selectedPrescription.userNotes && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>{t('prescriptions.notes')}:</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>{selectedPrescription.userNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('prescriptions.status')}</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed / Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Converted">Converted to Order</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{t('prescriptions.admin_notes')}</label>
                <textarea 
                  rows="3"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Approved. Will prepare order."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button type="button" variant="outline" onClick={() => setSelectedPrescription(null)} style={{ flex: 1 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updating} style={{ flex: 1 }}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrescriptions;
