import React from 'react';

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, backgroundColor: 'var(--background)', zIndex: 9999 }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem', borderTopColor: 'var(--primary)' }}></div>
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="spinner" style={{ width: '2rem', height: '2rem', borderTopColor: 'var(--primary)' }}></div>
    </div>
  );
};

export default Loader;
