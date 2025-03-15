import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Header from './components/header/header.tsx';
import Footer from './components/footer/footer.tsx';

interface FileEntry {
  path: string;
  content: string;
}

const App: React.FC = () => {
  // Use Vite's glob import to load all markdown files from the notes folder.
  // "as: 'raw'" loads the file content as a string, and "eager: true" makes it available at build time.
  const files = import.meta.glob('../notes/**/*.md', { as: 'raw', eager: true }) as Record<string, string>;

  // Convert the object into an array of file entries for easier manipulation.
  const fileEntries: FileEntry[] = useMemo(() => {
    return Object.entries(files).map(([path, content]) => ({
      path,
      content,
    }));
  }, [files]);

  // Local state for search query and the selected file.
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);

  // Filter the list of files based on the search query.
  const filteredFiles = useMemo(() => {
    return fileEntries.filter((file) =>
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, fileEntries]);

  return (
    <div>
    <Header />
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar: Search box and list of note files */}
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

      {/* Main content: Render selected markdown file */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        {selectedFile ? (
          <ReactMarkdown>{selectedFile.content}</ReactMarkdown>
        ) : (
          <p>Select a note from the sidebar to view its content.</p>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default App;
