import React from 'react';

const Banner: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
        color: '#fff',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
        <h1 style={{ fontSize: '3rem', margin: 0 }}>⚠️ WARNING ⚠️</h1>
        <p style={{ marginTop: '1rem' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
    </div>
  );
};

export default Banner;
