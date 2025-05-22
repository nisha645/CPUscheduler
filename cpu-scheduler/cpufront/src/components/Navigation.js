import React from 'react';

const Navigation = ({ theme, toggleTheme, currentPage, setCurrentPage }) => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <button 
          className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          Home
        </button>
        <button 
          className={`nav-button ${currentPage === 'scheduler' ? 'active' : ''}`}
          onClick={() => setCurrentPage('scheduler')}
        >
          CPU Scheduler
        </button>
      </div>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </nav>
  );
};

export default Navigation;