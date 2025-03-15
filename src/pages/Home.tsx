import React from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/banner/Banner';

const Home: React.FC = () => {
  return (
    <div>
      <Banner />
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome to Your Notes App</h1>
        <p>This is the home page. You can search and view your notes by clicking below.</p>
        <Link
          to="/notes"
          style={{
            padding: '0.5rem 1rem',
            background: '#007acc',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Go to Notes
        </Link>
      </div>
    </div>
  );
};

export default Home;
