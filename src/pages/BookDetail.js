import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chapter from '../components/Chapter';
import styles from './BookDetail.module.css';

function BookDetail({ isDark, onToggleTheme, apiBaseUrl }) {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/books/${bookId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('کتاب مورد نظر یافت نشد');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBook(data);
    } catch (err) {
      console.error('❌ Error fetching book details:', err);
      setError(err.message);
      
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  const handleRetry = () => {
    fetchBookDetails();
  };

  if (loading) {
    return (
      <div className={styles.bookDetailContainer}>
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
          <p>در حال بارگذاری اطلاعات کتاب...</p>
        </div>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className={styles.notFound}>
        <h2>📖 {error}</h2>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          بازگشت به کتابخانه
        </button>
        <button onClick={handleRetry} className={styles.retryButton}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.notFound}>
        <h2>📖 کتاب مورد نظر یافت نشد</h2>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          بازگشت به کتابخانه
        </button>
      </div>
    );
  }

  return (
    <div className={styles.bookDetailContainer}>
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

      <div className={styles.bookHeader}>
        <div className={styles.bookCoverContainer}>
          <img 
            src={book.coverUrl} 
            alt={`جلد کتاب ${book.title}`}
            className={styles.bookCover}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/300x400/${isDark ? '1e1e1e' : 'f5f5f5'}/${isDark ? 'e0e0e0' : '333333'}?text=${encodeURIComponent(book.title.substring(0, 30))}`;
            }}
          />
        </div>
        
        <div className={styles.bookInfo}>
          <h1 className={styles.bookTitle}>{book.title}</h1>
          <div className={styles.bookMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>نویسنده:</span>
              <span className={styles.metaValue}>{book.author}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>سال انتشار:</span>
              <span className={styles.metaValue}>{book.year}</span>
            </div>
          </div>
          
          <div className={styles.bookDescription}>
            <h3>📝 درباره کتاب</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>

      <main className={styles.content}>
        <div className={styles.chaptersHeader}>
          <h2 className={styles.chaptersTitle}>📖 فصول کتاب</h2>
          <p className={styles.chaptersSubtitle}>
            روی عنوان هر فصل کلیک کنید تا خلاصه و فایل صوتی آن را مشاهده کنید
          </p>
        </div>

        {error && (
          <div className={styles.errorSection}>
            <p className={styles.errorText}>
              {error} (نمایش اطلاعات ذخیره شده)
            </p>
          </div>
        )}

        <div className={styles.chaptersList}>
          {book.chapters.map((chapter) => (
            <Chapter
              key={chapter.id}
              id={chapter.id}
              title={chapter.title}
              summary={chapter.summary}
              audioUrl={chapter.audioUrl}
              isExpanded={expandedChapter === chapter.id}
              onToggle={() => toggleChapter(chapter.id)}
              isDark={isDark}
            />
          ))}
          
          {book.chapters.length === 0 && (
            <div className={styles.noChapters}>
              <p>هیچ فصلی برای این کتاب ثبت نشده است.</p>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <button 
          className={styles.backToLibrary}
          onClick={() => navigate('/')}
        >
          بازگشت به کتابخانه
        </button>
        
        <div className={styles.bookStats}>
          <span className={styles.statItem}>
            تعداد فصل‌ها: {book.chapters.length}
          </span>
          <span className={styles.statItem}>
            {book.chapters.some(c => c.audioUrl) ? 'دارای فایل صوتی' : 'بدون فایل صوتی'}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default BookDetail;