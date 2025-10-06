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
          <div className={styles.heroBgPattern}></div>
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
          <div className={styles.heroBgPattern}></div>
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
        <div className={styles.heroBgPattern}></div>
        
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
            <div className={styles.stat}>
              <span className={styles.statNumber}>{filteredUsers.length}</span>
              <span className={styles.statLabel}>Filtered</span>
            </div>
          </div>
        </div>

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
          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className={styles.userNameCell}>
                      <div className={styles.userAvatarTable}>
                        <i className="fas fa-user"></i>
                      </div>
                      {user.name || 'No name provided'}
                    </td>
                    <td className={styles.userEmailCell}>{user.email}</td>
                    <td>{user.phone || 'No phone provided'}</td>
                    <td>{user.address || 'No address provided'}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className={styles.userActionsCell}>
                      <button className={styles.viewButton}>
                        <i className="fas fa-eye"></i> View
                      </button>
                      <button className={styles.editButton}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminAuthWrapper>
  );
}