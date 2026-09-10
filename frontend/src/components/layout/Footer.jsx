import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--surface)', padding: '2rem 0', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Al-Amal Pharmacy</h3>
          <p>Your trusted medical partner.</p>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()} Al-Amal Pharmacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
