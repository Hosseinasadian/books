import React from 'react';
import styles from './BookHeader.module.css';

function BookHeader({ title, coverUrl, onToggleTheme, isDark }) {
  return (
    <header className={styles.bookHeader}>
      <div className={styles.headerActions}>
        <button 
          className={styles.iconBtn}
          onClick={onToggleTheme}
          aria-label={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
          title={isDark ? "تم روشن" : "تم تاریک"}
        >
          {isDark ? '☀️' : '🌓'}
        </button>
      </div>
      
      <img 
        src={coverUrl} 
        className={styles.bookCover} 
        alt={`جلد کتاب ${title}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/250x350/1e1e1e/ffffff?text=Book+Cover";
        }}
      />
      <h1 className={styles.bookTitle}>{title}</h1>
    </header>
  );
}

export default BookHeader;