import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BookList.module.css';

function BookList({ isDark, onToggleTheme, apiBaseUrl }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/books`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('❌ Error fetching books:', err);
      setError('خطا در بارگذاری کتاب‌ها. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  },[apiBaseUrl])

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleRetry = () => {
    fetchBooks();
  };

  if (loading) {
    return (
      <div className={styles.bookListContainer}>
        <header className={styles.header}>
          <h1 className={styles.libraryTitle}>📚 کتابخانه برنامه‌نویسی</h1>
          <button 
            className={styles.themeToggle}
            onClick={onToggleTheme}
            aria-label={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
          >
            {isDark ? '☀️' : '🌓'}
          </button>
        </header>
        
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>در حال بارگذاری کتاب‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookListContainer}>
      <header className={styles.header}>
        <h1 className={styles.libraryTitle}>📚 کتابخانه برنامه‌نویسی</h1>
        <button 
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
        >
          {isDark ? '☀️' : '🌓'}
        </button>
      </header>

      <div className={styles.introSection}>
        <p className={styles.introText}>
          به کتابخانه دیجیتال برنامه‌نویسی خوش آمدید. 
          {books.length > 0 && ` ${books.length} کتاب موجود است.`}
        </p>
      </div>

      {error && (
        <div className={styles.errorSection}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={handleRetry} className={styles.retryButton}>
            تلاش مجدد
          </button>
        </div>
      )}

      <div className={styles.booksGrid}>
        {books.map((book) => (
          <div 
            key={book.id}
            className={styles.bookCard}
            onClick={() => handleBookClick(book.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleBookClick(book.id)}
          >
            <div className={styles.bookCoverWrapper}>
              <img 
                src={book.coverUrl} 
                alt={`جلد کتاب ${book.title}`}
                className={styles.bookCover}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/200x300/${isDark ? '1e1e1e' : 'f5f5f5'}/${isDark ? 'e0e0e0' : '333333'}?text=${encodeURIComponent(book.title.substring(0, 30))}`;
                }}
              />
            </div>
            
            <div className={styles.bookInfo}>
              <h3 className={styles.bookTitle}>{book.title}</h3>
              <p className={styles.bookAuthor}>نویسنده: {book.author}</p>
              <p className={styles.bookDescription}>{book.description}</p>
              <div className={styles.bookMeta}>
                <span className={styles.bookYear}>📅 {book.year}</span>
                <span className={styles.bookChapters}>📖 مشاهده جزئیات</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          با ❤️ ساخته شد تا یادگیری را لذت‌بخش‌تر کنیم
        </p>
      </footer>
    </div>
  );
}

export default BookList;