import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import './App.css';

// آدرس API - در production از محیط می‌خوانیم
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://book-api-8z8v.onrender.com/api';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">📚 در حال راه‌اندازی...</div>
      </div>
    );
  }

  return (
    <Router basename="/books">
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              <BookList 
                isDark={isDark} 
                onToggleTheme={toggleTheme} 
                apiBaseUrl={API_BASE_URL}
              />
            } 
          />
          <Route 
            path="/book/:bookId" 
            element={
              <BookDetail 
                isDark={isDark} 
                onToggleTheme={toggleTheme} 
                apiBaseUrl={API_BASE_URL}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;