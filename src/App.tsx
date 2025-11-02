import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ArtGenerator from './components/ArtGenerator';
import Gallery from './components/Gallery';
import MoodJournal from './components/MoodJournal';
import './App.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Create Art', icon: '🎨' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/mood-journal', label: 'Mood Journal', icon: '📝' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <div className="brand-icon">🧠</div>
        <span className="brand-text">Express & Create</span>
      </div>
      
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="nav-actions">
        <button className="action-button" title="Favorites">⭐</button>
        <button className="action-button" title="Download">⬇️</button>
        <button className="action-button" title="Share">📤</button>
        <button className="action-button" title="Profile">👤</button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [generatedArtworks, setGeneratedArtworks] = useState<any[]>([]);

  const handleArtGenerated = (artwork: any) => {
    setGeneratedArtworks(prev => [artwork, ...prev]);
  };

  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<ArtGenerator onArtGenerated={handleArtGenerated} />} 
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/mood-journal" element={<MoodJournal />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2024 Express & Create - Generative Art Therapy</p>
          <p>Transform your emotions into beautiful therapeutic art</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
