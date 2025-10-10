'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cookieUtils } from '../../lib/cookies';
import styles from './BookingsPage.module.css';

const MyBookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancellingBooking, setCancellingBooking] = useState(null);

  // Cross-tab logout synchronization
  useEffect(() => {
    const handleLogout = () => {
      setBookings([]);
      setError('You have been logged out');
      setLoading(false);
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      setLoading(true);
      setError('');

      // First check if user is authenticated
      const authResponse = await fetch('/api/auth/check-auth', {
        credentials: 'include'
      });

      if (!authResponse.ok) {
        if (authResponse.status === 401) {
          setError('Please login to view your bookings');
          setLoading(false);
          return;
        } else {
          setError('Authentication check failed. Please try again.');
          setLoading(false);
          return;
        }
      }

      // If authenticated, fetch bookings
      const response = await fetch('/api/bookings', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else if (response.status === 401) {
        // Clear invalid token and show login prompt
        cookieUtils.removeToken();
        setError('Your session has expired. Please login again.');
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
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const cancelBooking = async (bookingId) => {
    try {
      setCancellingBooking(bookingId);
      const token = cookieUtils.getToken();

      if (!token) {
        setError('Please login to cancel bookings');
        return;
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update the booking status locally
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        setError(''); // Clear any existing errors
        alert(data.message || 'Booking cancelled successfully!');
      } else if (response.status === 401) {
        cookieUtils.removeToken();
        setError('Your session has expired. Please login again.');
      } else {
        // Handle error response without trying to parse JSON directly
        let errorMessage = 'Failed to cancel booking. Please try again.';
        try {
          // Clone the response to avoid consuming it twice
          const responseClone = response.clone();
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
              console.error('Error parsing JSON response:', jsonError);
              // Fallback to text if JSON parsing fails
              const textContent = await responseClone.text();
              if (textContent) {
                errorMessage = textContent;
              }
            }
          } else {
            // Try to get text content if not JSON
            const textContent = await response.text();
            if (textContent) {
              errorMessage = textContent;
            }
          }
        } catch (parseError) {
          console.error('Error handling response:', parseError);
          // Use default error message if all parsing fails
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setCancellingBooking(null);
    }
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
        }}>Loading your bookings...</p>
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
        <p>You haven't made any bookings yet.</p>
        <Link href="/" className={styles.exploreBtn}>
          Explore Routes & Tours
        </Link>
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
              <div style={{ fontSize: '3rem' }}>🔐</div>
              <h2>Authentication Required</h2>
              <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.7)' }}>{error}</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={checkAuthAndFetchBookings} className={styles.retryBtn}>
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/login')}
                  style={{
                    padding: '0.8rem 2rem',
                    background: 'linear-gradient(45deg, #ff6b35, #ffb938)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem'
                  }}
                >
                  Login
                </button>
              </div>
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
          <h1>My Bookings</h1>
          <p>Manage your route and tour bookings</p>
        </div>

        {/* Filter Tabs */}
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

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.bookingsGrid}>
            {filteredBookings.map((booking) => (
              <div key={booking._id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingImage}>
                    <Image
                      src={
                        booking.bookingType === 'route'
                          ? booking.routeId?.image || "/api/placeholder/300/200"
                          : booking.bookingType === 'tour'
                          ? booking.tourId?.image || "/api/placeholder/300/200"
                          : booking.bookingType === 'cab'
                          ? booking.image || "/api/placeholder/300/200"
                          : "/api/placeholder/300/200"
                      }
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
                        {booking.bookingType === 'route' ? '🚗 Route' : booking.bookingType === 'cab' ? '🚗 Cab' : '🏛️ Tour'}
                      </span>
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
                      {booking.routeId.carOptions && booking.routeId.carOptions.length > 0 && (
                        <div className={styles.detailRow}>
                          <span className={styles.label}>Luggage:</span>
                          <span className={styles.value}>{booking.routeId.carOptions[0].luggage}</span>
                        </div>
                      )}
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

                  {/* From/To Locations */}
                  {booking.fromLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>From:</span>
                      <span className={styles.value}>{booking.fromLocation}</span>
                    </div>
                  )}
                  {booking.toLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>To:</span>
                      <span className={styles.value}>{booking.toLocation}</span>
                    </div>
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
                </div>

                <div className={styles.bookingFooter}>
                  <div className={styles.statusContainer}>
                    <span
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    {booking.status === 'pending' && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancellingBooking === booking._id}
                      >
                        {cancellingBooking === booking._id ? 'Cancelling...' : 'Cancel'}
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

export default MyBookingsPage;
