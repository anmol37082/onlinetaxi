"use client";
import { useState } from "react";
import styles from './AdminPanel.module.css';
import ChangePasswordModal from '../components/ChangePasswordModal';
import AdminAuthWrapper from '../components/AdminAuthWrapper';

function AdminPanelContent() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/admin/login';
    }
  };

  const handleChangePasswordSuccess = () => {
    console.log('Password changed successfully');
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroBgPattern}></div>
      <div className={styles.wrapper}>
        {/* Admin Header */}
        <div className={styles.adminHeader}>
          <div className={styles.adminInfo}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            {adminInfo && (
              <p className={styles.welcomeMessage}>Welcome, {adminInfo.name}</p>
            )}
          </div>
          <div className={styles.adminActions}>
            <button
              className={`${styles.actionButton} ${styles.changePasswordButton}`}
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
            <button
              className={`${styles.actionButton} ${styles.logoutButton}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Dashboard Cards */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Bookings</h2>
            <p className={styles.cardDescription}>Manage and track all taxi bookings efficiently</p>
            <a href="/admin/bookings" className={`${styles.cardButton} ${styles.bookingsButton}`}>
              View Bookings
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>👥 Users</h2>
            <p className={styles.cardDescription}>Manage user accounts and permissions</p>
            <a href="/admin/users" className={`${styles.cardButton} ${styles.usersButton}`}>
              View Users
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🗺️ Top Routes</h2>
            <p className={styles.cardDescription}>Monitor and manage popular travel routes</p>
            <a href="/admin/toproutes" className={`${styles.cardButton} ${styles.routesButton}`}>
              View Routes
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🎯 Tours</h2>
            <p className={styles.cardDescription}>Create and manage tour packages</p>
            <a href="/admin/tours" className={`${styles.cardButton} ${styles.toursButton}`}>
              View Tours
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⭐ Reviews</h2>
            <p className={styles.cardDescription}>Monitor customer feedback and ratings</p>
            <a href="/admin/reviews" className={`${styles.cardButton} ${styles.reviewsButton}`}>
              View Reviews
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>📞 Contacts</h2>
            <p className={styles.cardDescription}>View and respond to contact inquiries</p>
            <a href="/admin/contacts" className={`${styles.cardButton} ${styles.contactsButton}`}>
              View Contacts
            </a>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>🚖 Cabs</h2>
            <p className={styles.cardDescription}>Manage cab listings and pricing</p>
            <a href="/admin/cabs" className={`${styles.cardButton} ${styles.cabsButton}`}>
              View Cabs
            </a>
          </div>
        </div>

        {/* Analytics Section */}
        <div className={styles.analyticsSection}>
          <h2 className={styles.analyticsTitle}>📊 Analytics Dashboard</h2>
          <p className={styles.analyticsDescription}>
            Comprehensive analytics and reporting features coming soon. Track booking trends,
            revenue insights, and customer behavior patterns all in one place.
          </p>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSuccess={handleChangePasswordSuccess}
      />
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminAuthWrapper>
      <AdminPanelContent />
    </AdminAuthWrapper>
  );
}
