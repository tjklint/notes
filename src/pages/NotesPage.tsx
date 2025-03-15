// src/pages/NotesPage.tsx
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

interface FileEntry {
  path: string;
  content: string;
}

const NotesPage: React.FC = () => {
  // Vite's glob import to load all markdown files from the notes folder.
  const files = import.meta.glob('../../notes/**/*.md', { as: 'raw', eager: true }) as Record<string, string>;

  // Convert the object into an array of file entries.
  const fileEntries: FileEntry[] = useMemo(() => {
    return Object.entries(files).map(([path, content]) => ({
      path,
      content,
    }));
  }, [files]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  // Filter files based on the search query.
  const filteredFiles = useMemo(() => {
    return fileEntries.filter((file) =>
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, fileEntries]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '1rem', overflowY: 'auto' }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredFiles.map((file, index) => (
            <li
              key={index}
              onClick={() => setSelectedFile(file)}
              style={{ cursor: 'pointer', padding: '0.5rem', borderBottom: '1px solid #eee' }}
            >
              {file.path.split('/').pop()}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {selectedFile ? (
          <ReactMarkdown>{selectedFile.content}</ReactMarkdown>
        ) : (
          <p>Select a note from the sidebar to view its content.</p>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
