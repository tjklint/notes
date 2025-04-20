import React from 'react';

const NotesBanner: React.FC = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#1e1e1e',
        color: '#fff',
      }}
    >
      {/* Big, spaced out "N O T E S." */}
      <h2
        style={{
          fontSize: '4rem',
          letterSpacing: '0.5rem',
          margin: 0,
          fontWeight: 700,
        }}
      >
        NOTES
      </h2>

      {/* Three larger, styled buttons with equal width */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
        }}
      >
        {['Important', 'University', 'Other'].map((label) => (
          <button
            key={label}
            style={{
              width: '200px', // Fixed width for all buttons
              padding: '1.2rem 0', // Adjusted vertical padding; horizontal padding is now handled by width
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#646cff',
              color: '#fff',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#535bf2')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#646cff')
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Underlined sentence with hover effect */}
      <p
        style={{
          marginTop: '1.5rem',
          fontSize: '1rem',
          color: '#ccc',
        }}
      >
        <a
          href="#"
          style={{
            textDecoration: 'underline',
            color: '#1e1e1e',
            transition: 'color 0.3s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#646cff')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#1e1e1e')}
        >
          or access legacy...
        </a>
      </p>
    </div>
  );
};

export default NotesBanner;
