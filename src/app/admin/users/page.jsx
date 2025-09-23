'use client';

import { useState, useEffect } from 'react';
import styles from './AdminUsers.module.css';
import AdminAuthWrapper from '../../components/AdminAuthWrapper';


export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };



  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading users...</p>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  if (error) {
    return (
      <AdminAuthWrapper>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={fetchUsers} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <a href="/admin" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i>
              Back to Admin Panel
            </a>
          </div>
          <h1 className={styles.title}>User Management</h1>
          <p className={styles.subtitle}>Manage all registered customers</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{users.length}</span>
              <span className={styles.statLabel}>Total Users</span>
            </div>
          </div>
        </div>

        <div className={styles.usersGrid}>
          {filteredUsers.length === 0 ? (
            <div className={styles.noUsers}>
              <i className="fas fa-users"></i>
              <h3>No users found</h3>
              <p>
                {searchTerm
                  ? `No users match your search "${searchTerm}"`
                  : 'No users have registered yet'
                }
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className={styles.userCard}>
                <div className={styles.userHeader}>
                  <div className={styles.userAvatar}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>
                      {user.name || 'No name provided'}
                    </h3>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                </div>

                <div className={styles.userDetails}>
                  <div className={styles.detailRow}>
                    <i className="fas fa-phone"></i>
                    <span>{user.phone || 'No phone provided'}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{user.address || 'No address provided'}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <i className="fas fa-calendar"></i>
                    <span>Joined: {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                <div className={styles.userActions}>
                  <button className={styles.viewButton}>
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <button className={styles.editButton}>
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>

                </div>
              </div>
            ))
          )}
        </div>


      </div>
    </AdminAuthWrapper>
  );
}
