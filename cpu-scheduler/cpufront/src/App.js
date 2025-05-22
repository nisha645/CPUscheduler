import React, { useState, useEffect } from 'react';
import CPUScheduler from './components/CPUScheduler';
import Home from './components/Home';
import Navigation from './components/Navigation';


const App = () => {
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home />;
      case 'scheduler':
        return <CPUScheduler />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Navigation 
        theme={theme} 
        toggleTheme={toggleTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
};

export default App;