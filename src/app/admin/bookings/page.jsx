'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AdminBookings.module.css';

const AdminBookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filter, search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter }),
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/bookings?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setPagination(data.pagination);
        setTotalPages(data.pagination.total);
      } else if (response.status === 401) {
        router.push('/admin/login');
      } else {
        setError('Failed to load bookings. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus, adminNotes = '') => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          bookingId,
          status: newStatus,
          adminNotes
        })
      });

      if (response.ok) {
        // Refresh bookings list
        fetchBookings();
        alert('Booking status updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update booking: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#27ae60';
      case 'in-progress': return '#3498db';
      case 'completed': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Confirmation';
      case 'confirmed': return 'Confirmed';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const LoadingSpinner = () => (
    <div className={styles.loadingState}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{
            position: 'absolute',
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 107, 53, 0.1)',
            borderTop: '4px solid rgba(255, 107, 53, 0.8)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            top: '10px',
            left: '10px'
          }}></div>
        </div>
        <p style={{
          color: 'rgba(255, 107, 53, 0.9)',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}>Loading bookings...</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className={styles.emptyState}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ fontSize: '4rem' }}>📅</div>
        <h2>No Bookings Found</h2>
        <p>No bookings match your current filters.</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className={styles.bookingsSection}>
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.bookingsSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ fontSize: '3rem' }}>❌</div>
              <h2>Error</h2>
              <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.7)' }}>{error}</p>
              <button onClick={fetchBookings} className={styles.retryBtn}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.bookingsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Manage Bookings</h1>
            <p>Monitor and manage all customer bookings</p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => router.push('/admin')} className={styles.backBtn}>
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by booking reference, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={fetchBookings} className={styles.searchBtn}>
              🔍
            </button>
          </div>

          <div className={styles.filterTabs}>
            {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`${styles.filterTab} ${filter === status ? styles.active : ''}`}
              >
                {status === 'all' ? 'All' : getStatusText(status)}
                <span className={styles.count}>
                  ({bookings.filter(b => status === 'all' ? true : b.status === status).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.bookingsGrid}>
            {bookings.map((booking) => (
              <div key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingImage}>
                    <Image
                      src={booking.image || "/api/placeholder/300/200"}
                      alt={booking.title}
                      width={300}
                      height={200}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.bookingInfo}>
                    <h3>{booking.title}</h3>
                    <div className={styles.bookingMeta}>
                      <span className={styles.bookingRef}>
                        #{booking.bookingReference}
                      </span>
                      <span className={styles.bookingType}>
                        {booking.bookingType === 'route' ? '🚗 Route' : '🏛️ Tour'}
                      </span>
                    </div>
                    <div className={styles.userInfo}>
                      <p><strong>User:</strong> {booking.userName}</p>
                      <p><strong>Email:</strong> {booking.userEmail}</p>
                      <p><strong>Phone:</strong> {booking.userPhone}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Travel Date:</span>
                    <span className={styles.value}>{formatDate(booking.travelDate)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>{formatTime(booking.time)}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Passengers:</span>
                    <span className={styles.value}>{booking.passengers}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Total Price:</span>
                    <span className={styles.value}>₹{(booking.price * (booking.passengers || 1)).toLocaleString()}</span>
                  </div>

                  {/* Route Specific Details */}
                  {booking.bookingType === 'route' && booking.routeId && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Distance:</span>
                        <span className={styles.value}>{booking.routeId.distance}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Duration:</span>
                        <span className={styles.value}>{booking.routeId.duration}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Vehicle:</span>
                        <span className={styles.value}>{booking.routeId.carType}</span>
                      </div>
                    </>
                  )}

                  {/* Tour Specific Details */}
                  {booking.bookingType === 'tour' && booking.tourId && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Duration:</span>
                        <span className={styles.value}>{booking.tourId.duration}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Price per person:</span>
                        <span className={styles.value}>₹{booking.tourId.price}</span>
                      </div>
                    </>
                  )}

                  {/* Pickup/Drop Locations */}
                  {booking.pickupLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Pickup:</span>
                      <span className={styles.value}>{booking.pickupLocation}</span>
                    </div>
                  )}
                  {booking.dropLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Drop:</span>
                      <span className={styles.value}>{booking.dropLocation}</span>
                    </div>
                  )}

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <div className={styles.specialRequests}>
                      <span className={styles.label}>Special Requests:</span>
                      <span className={styles.value}>{booking.specialRequests}</span>
                    </div>
                  )}
                </div>

                <div className={styles.bookingFooter}>
                  <div className={styles.statusContainer}>
                    <span
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </span>
                    <span className={styles.createdAt}>
                      Created: {formatDate(booking.createdAt)}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className={styles.confirmBtn}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'in-progress')}
                          className={styles.progressBtn}
                        >
                          Start Trip
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className={styles.cancelBtn}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'in-progress' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        className={styles.completeBtn}
                      >
                        Complete
                      </button>
                    )}
                    <Link href={`/bookings/${booking._id}`} className={styles.viewBtn}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              Previous
            </button>

            <span className={styles.pageInfo}>
              Page {pagination.current} of {pagination.total}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total))}
              disabled={currentPage === pagination.total}
              className={styles.pageBtn}
            >
              Next
            </button>
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default AdminBookingsPage;
