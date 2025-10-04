'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookieUtils } from '../../lib/cookies';
import styles from './BookingForm.module.css';

const BookingReceipt = ({ selectedCar, routeData, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    message: '',
    date: '',
    time: ''
  });

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthenticationAndProfile();
  }, []);

  const checkAuthenticationAndProfile = async () => {
    try {
      setCheckingAuth(true);
      const token = cookieUtils.getToken();

      if (!token) {
        setError('Please login to make a booking');
        setCheckingAuth(false);
        return;
      }

      // Check profile completion first
      const profileCheckResponse = await fetch('/api/profile/check-completion', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileCheckResponse.ok) {
        const profileCheckData = await profileCheckResponse.json();
        setProfileComplete(profileCheckData.profileComplete);
        setUserProfile(profileCheckData.user);

        if (!profileCheckData.profileComplete) {
          setError('Please complete your profile details to make a booking');
        }
      } else {
        setError('Failed to load user profile. Please try logging in again.');
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      setError('Failed to verify authentication. Please try logging in again.');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = cookieUtils.getToken();
      if (!token) {
        setError('Please login to make a booking');
        return;
      }

      if (!profileComplete) {
        setError('Please complete your profile details before making a booking');
        return;
      }

      // Create booking payload with car-specific data
      const isCabBooking = !!selectedCar;
      const bookingPayload = {
        bookingType: isCabBooking ? 'cab' : 'route',
        title: routeData?.title || selectedCar?.Car || '',
        image: isCabBooking ? (selectedCar.Imgg || selectedCar.imgg || '') : (routeData?.image || ''),
        price: selectedCar?.Price || selectedCar?.price || 0,
        travelDate: formData.date,
        time: formData.time,
        specialRequests: formData.message,
        pickupLocation: formData.address,
        userPhone: formData.phone,
        routeId: routeData?._id,
        carDetails: isCabBooking ? {
          name: selectedCar?.Car || selectedCar?.name,
          luggage: selectedCar?.Luggage || selectedCar?.luggage,
          seats: selectedCar?.Seats || selectedCar?.seats,
          price: selectedCar?.Price || selectedCar?.price
        } : undefined
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to bookings page or show success message
        alert(`Booking created successfully! Booking Reference: ${data.booking.bookingReference}`);
        router.push('/bookings');
      } else {
        setError(data.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show login prompt if not authenticated
  if (error && error.includes('login') && !checkingAuth) {
    return (
      <div className={styles.bookingForm}>
        <div className={styles.formHeader}>
          <h2>Authentication Required</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.error}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
            <h3>Please Login</h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(0,0,0,0.7)' }}>
              You need to login to your account to make a booking.
            </p>
            <button
              onClick={() => router.push('/login')}
              className={styles.loginBtn}
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
              Login to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show profile completion prompt if profile is incomplete
  if (!profileComplete && !checkingAuth && userProfile) {
    return (
      <div className={styles.bookingForm}>
        <div className={styles.formHeader}>
          <h2>Complete Your Profile</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.error}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
            <h3>Profile Incomplete</h3>
            <p style={{ marginBottom: '1.5rem', color: 'rgba(0,0,0,0.7)' }}>
              Please complete your profile details to make a booking.
            </p>
            <button
              onClick={() => router.push('/profile')}
              className={styles.loginBtn}
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
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className={styles.bookingForm}>
        <div className={styles.formHeader}>
          <h2>Loading...</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingForm}>
      <div className={styles.formHeader}>
        <h2>🚗 Booking Receipt</h2>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>

      {/* Booking Details Section */}
      <div style={{
        background: 'rgba(255, 107, 53, 0.05)',
        border: '1px solid rgba(255, 107, 53, 0.2)',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          color: '#ff6b35',
          marginBottom: '1rem',
          fontSize: '1.3rem',
          fontWeight: '700'
        }}>📋 Booking Details</h3>

        {/* Cab Image */}
        {selectedCar?.Imgg && (
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <img
              src={selectedCar.Imgg.startsWith('http') ? selectedCar.Imgg : `/images/${selectedCar.Imgg}`}
              alt={selectedCar.Car || selectedCar.name}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div>
            <strong style={{ color: '#555' }}>Going From:</strong>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              {routeData?.fromCity || selectedCar?.From || 'N/A'}
            </p>
          </div>
          <div>
            <strong style={{ color: '#555' }}>Going To:</strong>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              {routeData?.toCity || selectedCar?.To || selectedCar?.City || 'N/A'}
            </p>
          </div>
          <div>
            <strong style={{ color: '#555' }}>Selected Car:</strong>
            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
              {selectedCar?.Car || selectedCar?.name || 'N/A'}
            </p>
          </div>
          <div>
            <strong style={{ color: '#555' }}>Price:</strong>
            <p style={{
              margin: '0.5rem 0',
              fontSize: '1.1rem',
              color: '#ff6b35',
              fontWeight: '700'
            }}>
              {formatPrice(selectedCar?.Price || selectedCar?.price || 0)}
            </p>
          </div>
        </div>

        {/* Car Features Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 107, 53, 0.1)',
          borderRadius: '10px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h4 style={{
            color: '#ff6b35',
            marginBottom: '0.8rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>🚗 Car Features</h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.8rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>👥</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Seats:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  {selectedCar?.Seats || selectedCar?.seats || 'N/A'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>❄️</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>AC:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  Yes
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>⛽</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Fuel Type:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  CNG/Petrol/Diesel
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🛄</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Luggage:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  {selectedCar?.Luggage || selectedCar?.luggage || 'N/A'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🔌</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Phone Charger:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  Yes
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🎵</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Music System:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  Yes
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🚭</span>
              <div>
                <strong style={{ color: '#333', fontSize: '0.9rem' }}>Smoking:</strong>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>
                  Not Allowed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 185, 56, 0.1)',
          border: '1px solid rgba(255, 185, 56, 0.3)',
          borderRadius: '10px',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <p style={{
            margin: 0,
            color: '#d68910',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            📌 Note: Parking extra charging
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter pickup address"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Travel Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Time *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Message</label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Any special requests or requirements..."
            rows={3}
          />
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingReceipt;
