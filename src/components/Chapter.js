import React from 'react';
import styles from './Chapter.module.css';

function Chapter({ id, title, summary, audioUrl, isExpanded, onToggle }) {
  return (
    <div className={styles.chapter} id={id}>
      <button 
        className={styles.chapterHeader}
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`${id}-content`}
      >
        <span className={styles.chapterTitle}>{title}</span>
        <span className={styles.arrow}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>
      
      {isExpanded && (
        <div 
          id={`${id}-content`}
          className={styles.chapterBody}
          role="region"
          aria-labelledby={id}
        >
          <div className={styles.summaryContainer}>
            <p className={styles.summaryText}>{summary}</p>
          </div>
          <audio 
            controls 
            className={styles.audioPlayer}
            preload="metadata"
          >
            <source src={audioUrl} type="audio/mpeg" />
            مرورگر شما از پخش صوتی پشتیبانی نمی‌کند.
          </audio>
        </div>
      )}
    </div>
  );
}

export default Chapter;