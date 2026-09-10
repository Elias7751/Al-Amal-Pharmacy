import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Prescriptions = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions/my-prescriptions');
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch prescriptions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPrescriptions();
  }, [user, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMsg('');

    const formData = new FormData();
    formData.append('image', file);
    if (notes) formData.append('userNotes', notes);

    try {
      await api.post('/prescriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMsg(t('prescriptions.success_upload') + ' ✅');
      setFile(null);
      setNotes('');
      // Refresh list
      fetchPrescriptions();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || t('prescriptions.error_upload'));
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Converted':
        return 'var(--success)';
      case 'Rejected':
        return 'var(--danger)';
      default:
        return '#f59e0b'; // warning/pending
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case 'Pending': return t('prescriptions.pending');
      case 'Reviewed': return t('prescriptions.reviewed');
      case 'Rejected': return t('prescriptions.rejected');
      case 'Converted': return t('prescriptions.converted');
      default: return status;
    }
  };

  // Base URL for images, assuming server runs on port 5000 and uploads are served at /uploads
  // For production, this should be handled properly via env variables, but we can construct it dynamically
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{t('prescriptions.my_prescriptions')}</h1>

      {/* Upload Form */}
      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>{t('prescriptions.upload_prescription')}</h3>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {msg && <div style={{ color: msg.includes('✅') ? 'var(--success)' : 'var(--danger)' }}>{msg}</div>}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('prescriptions.image')}</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--background)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('prescriptions.notes')}</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('prescriptions.notes_placeholder')}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--background)',
                resize: 'vertical'
              }}
            />
          </div>

          <Button type="submit" variant="primary" disabled={uploading || !file}>
            {uploading ? t('prescriptions.uploading') : t('prescriptions.submit')}
          </Button>
        </form>
      </div>

      {/* List of Prescriptions */}
      {prescriptions.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>{t('prescriptions.no_prescriptions')}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              
              <div style={{ flex: '0 0 200px' }}>
                <img 
                  src={getImageUrl(prescription.image)} 
                  alt="Prescription" 
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', objectFit: 'cover' }} 
                />
              </div>

              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {t('prescriptions.date')}: {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.875rem', 
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(prescription.status),
                    color: 'white'
                  }}>
                    {getStatusTranslation(prescription.status)}
                  </div>
                </div>

                {prescription.userNotes && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>{t('prescriptions.notes')}:</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>{prescription.userNotes}</p>
                  </div>
                )}

                {prescription.adminNotes && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                    <strong style={{ color: 'var(--primary)' }}>{t('prescriptions.admin_notes')}:</strong>
                    <p style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>{prescription.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
