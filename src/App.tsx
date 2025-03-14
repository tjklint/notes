import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('# Hello, Markdown!\n\nEdit me...');

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Markdown Reader</h1>
      <textarea
        style={{
          width: '100%',
          height: '150px',
          padding: '0.5rem',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <hr />
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default App;
