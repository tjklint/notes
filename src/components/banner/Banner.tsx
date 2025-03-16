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
                <h1 style={{ fontSize: '2rem', margin: 0 }}>⚠️ WARNING ⚠️</h1>
                <p className="warningText" style={{ marginTop: '1rem', padding: '0 25%' }}>
                Welcome to my (TJ Klint) notes site. If you're not a friend or classmate, you might either be in the 
                wrong place or not find much that sparks your interest. Looking for my portfolio? You'll find a link 
                in the header. And if you feel like snooping around, go ahead, just be ready to learn about Linked Lists! :p
                </p>
        </div>
    );
};

export default Banner;
