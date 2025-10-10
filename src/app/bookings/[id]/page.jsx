'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cookieUtils } from '../../../lib/cookies';
import styles from './BookingDetail.module.css';

const BookingDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetail();
  }, [params.id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const token = cookieUtils.getToken();

      if (!token) {
        setError('Please login to view booking details');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/bookings/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else if (response.status === 401) {
        // Clear invalid token and show login prompt
        cookieUtils.removeToken();
        setError('Your session has expired. Please login again.');
      } else if (response.status === 404) {
        setError('Booking not found');
      } else {
        setError('Failed to load booking details. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching booking detail:', err);
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
        }}>Loading booking details...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
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
          <button onClick={fetchBookingDetail} className={styles.retryBtn}>
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
  );

  if (loading) {
    return (
      <section className={styles.bookingDetailSection}>
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.bookingDetailSection}>
        <div className={styles.container}>
          <ErrorState />
        </div>
      </section>
    );
  }

  if (!booking) {
    return (
      <section className={styles.bookingDetailSection}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <h2>Booking Not Found</h2>
            <p>The booking you're looking for doesn't exist or has been removed.</p>
            <Link href="/bookings" className={styles.backBtn}>
              Back to My Bookings
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.bookingDetailSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <button onClick={() => router.back()} className={styles.backButton}>
              ← Back to Bookings
            </button>
            <div className={styles.bookingMeta}>
              <span className={styles.bookingRef}>
                Booking #{booking.bookingReference}
              </span>
              <span className={styles.bookingType}>
                {booking.bookingType === 'route' ? '🚗 Route' : booking.bookingType === 'cab' ? '🚕 Cab (Not Route)' : '🏛️ Tour'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Main Booking Info */}
          <div className={styles.mainInfo}>
            <div className={styles.imageSection}>
              <Image
                src={booking.image || "/api/placeholder/400/250"}
                alt={booking.title}
                width={400}
                height={250}
                className={styles.mainImage}
              />
            </div>

            <div className={styles.detailsSection}>
              <h1 className={styles.title}>{booking.title}</h1>

              <div className={styles.statusContainer}>
                <span
                  className={styles.status}
                  style={{ backgroundColor: getStatusColor(booking.status) }}
                >
                  {getStatusText(booking.status)}
                </span>
              </div>

              {/* Basic Booking Details */}
              <div className={styles.basicDetails}>
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
              </div>

              {/* Route Specific Details */}
              {booking.bookingType === 'route' && booking.routeId && (
                <div className={styles.routeDetails}>
                  <h3>Route Information</h3>
                  <div className={styles.routeGrid}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>From:</span>
                      <span className={styles.value}>{booking.routeId.fromCity || booking.pickupLocation}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>To:</span>
                      <span className={styles.value}>{booking.routeId.toCity || booking.dropLocation}</span>
                    </div>
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
                    {booking.routeId.carOptions && booking.routeId.carOptions.length > 0 && (
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Seats:</span>
                        <span className={styles.value}>{booking.routeId.carOptions[0].seats}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cab Specific Details */}
              {booking.bookingType === 'cab' && booking.carDetails && (
                <div className={styles.cabDetails}>
                  <h3>Cab Information</h3>
                  <div className={styles.cabGrid}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Car Name:</span>
                      <span className={styles.value}>{booking.carDetails.name}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Seats:</span>
                      <span className={styles.value}>{booking.carDetails.seats}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Luggage:</span>
                      <span className={styles.value}>{booking.carDetails.luggage}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Price:</span>
                      <span className={styles.value}>₹{booking.carDetails.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cab Route Details */}
              {booking.bookingType === 'cab' && (booking.fromLocation || booking.toLocation) && (
                <div className={styles.routeDetails}>
                  <h3>Route Information</h3>
                  <div className={styles.routeGrid}>
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
                  </div>
                </div>
              )}

              {/* Tour Specific Details */}
              {booking.bookingType === 'tour' && booking.tourId && (
                <div className={styles.tourDetails}>
                  <h3>Tour Information</h3>
                  <div className={styles.tourGrid}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Duration:</span>
                      <span className={styles.value}>{booking.tourId.duration}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Price per person:</span>
                      <span className={styles.value}>₹{booking.tourId.price}</span>
                    </div>
                  </div>

                  {/* Tour Itinerary */}
                  {booking.tourId.days && booking.tourId.days.length > 0 && (
                    <div className={styles.itinerary}>
                      <h4>Tour Itinerary</h4>
                      <div className={styles.itineraryList}>
                        {booking.tourId.days.map((day, index) => (
                          <div key={index} className={styles.itineraryDay}>
                            <h5>{day.dayTitle}</h5>
                            <div className={styles.dayActivities}>
                              {day.morning && <p><strong>Morning:</strong> {day.morning}</p>}
                              {day.afternoon && <p><strong>Afternoon:</strong> {day.afternoon}</p>}
                              {day.evening && <p><strong>Evening:</strong> {day.evening}</p>}
                              {day.night && <p><strong>Night:</strong> {day.night}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tour Summary */}
                  {booking.tourId.summaryText && (
                    <div className={styles.tourSummary}>
                      <h4>Tour Summary</h4>
                      <p>{booking.tourId.summaryText}</p>
                    </div>
                  )}

                  {/* Travel Tips */}
                  {booking.tourId.travelTips && booking.tourId.travelTips.length > 0 && (
                    <div className={styles.travelTips}>
                      <h4>Travel Tips</h4>
                      <ul>
                        {booking.tourId.travelTips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Details */}
              {(booking.pickupLocation || booking.dropLocation) && (
                <div className={styles.additionalDetails}>
                  <h3>Additional Details</h3>
                  {booking.pickupLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Pickup Location:</span>
                      <span className={styles.value}>{booking.pickupLocation}</span>
                    </div>
                  )}
                  {booking.dropLocation && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Drop Location:</span>
                      <span className={styles.value}>{booking.dropLocation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className={styles.specialRequests}>
                  <h3>Special Requests</h3>
                  <p>{booking.specialRequests}</p>
                </div>
              )}

              {/* User Information */}
              <div className={styles.userInfo}>
                <h3>Contact Information</h3>
                <div className={styles.userGrid}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{booking.userName}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{booking.userEmail}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>{booking.userPhone}</span>
                  </div>
                  {booking.userAddress && (
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Address:</span>
                      <span className={styles.value}>{booking.userAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default BookingDetailPage;
