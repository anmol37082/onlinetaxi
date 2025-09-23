'use client';

import { useState, useEffect } from 'react';
import styles from './LoginHistory.module.css';

export default function LoginHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLoginHistory(currentPage);
  }, [currentPage]);

  const fetchLoginHistory = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/login-history?page=${page}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch login history');
      }

      const data = await response.json();
      setHistory(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    return action === 'login' ? '🔐' : '🔓';
  };

  const getActionColor = (action) => {
    return action === 'login' ? styles.login : styles.logout;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Login History</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading login history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3>Login History</h3>
        </div>
        <div className={styles.error}>
          <p>❌ Error: {error}</p>
          <button onClick={() => fetchLoginHistory(currentPage)} className={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>🔐 Login History</h3>
        <p className={styles.subtitle}>Track your account access activity</p>
      </div>

      {history.length === 0 ? (
        <div className={styles.empty}>
          <p>📊 No login history found</p>
          <p className={styles.emptySubtitle}>Your login activities will appear here</p>
        </div>
      ) : (
        <>
          <div className={styles.historyList}>
            {history.map((entry, index) => (
              <div key={index} className={styles.historyItem}>
                <div className={styles.actionInfo}>
                  <span className={styles.actionIcon}>
                    {getActionIcon(entry.action)}
                  </span>
                  <div className={styles.actionDetails}>
                    <span className={`${styles.action} ${getActionColor(entry.action)}`}>
                      {entry.action.toUpperCase()}
                    </span>
                    <span className={styles.timestamp}>
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                </div>

                <div className={styles.deviceInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>IP Address:</span>
                    <span className={styles.value}>{entry.ipAddress}</span>
                  </div>

                  {entry.location && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Location:</span>
                      <span className={styles.value}>{entry.location}</span>
                    </div>
                  )}

                  {entry.deviceInfo && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Device:</span>
                      <span className={styles.value}>{entry.deviceInfo}</span>
                    </div>
                  )}

                  {entry.sessionDuration > 0 && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Duration:</span>
                      <span className={styles.value}>
                        {Math.floor(entry.sessionDuration / 60)}h {entry.sessionDuration % 60}m
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.pageButton}
              >
                Previous
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.pageButton} ${
                      page === currentPage ? styles.activePage : ''
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
