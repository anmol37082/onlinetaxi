'use client';

import { useState } from 'react';
import styles from './MessageModal.module.css';

export default function MessageModal({ isOpen, onClose, recipient }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setTitle('');
    setMessage('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show message that functionality is disabled
    alert('Message functionality has been disabled. This is a UI-only component.');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Send Message</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div className={styles.recipientInfo}>
          <h3>Recipient:</h3>
          <p className={styles.recipientName}>{recipient.name}</p>
          <p className={styles.recipientEmail}>{recipient.email}</p>
        </div>

        <div className={styles.disabledMessage}>
          <p><strong>Note:</strong> Message functionality has been disabled. This modal is for UI display only.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Enter message title..."
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
              placeholder="Enter your message..."
              rows={5}
              maxLength={1000}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.sendButton}
            >
              Send Message (Disabled)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
