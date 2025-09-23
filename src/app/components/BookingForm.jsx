'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookieUtils } from '../../lib/cookies';
import styles from './BookingForm.module.css';

const BookingForm = ({ bookingType, itemData, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bookingType: bookingType || 'route',
    title: itemData?.title || '',
    image: itemData?.image || '',
    price: itemData?.currentPrice || itemData?.price || 0,
    travelDate: '',
    time: '',
    specialRequests: '',
    pickupLocation: '',
    userPhone: ''
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

      // Add route/tour ID based on booking type
      const bookingPayload = {
        ...formData,
        ...(bookingType === 'route' && { routeId: itemData?._id }),
        ...(bookingType === 'tour' && { tourId: itemData?._id })
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
        <h2>Book {bookingType === 'route' ? 'Route' : 'Tour'}</h2>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>

      {itemData && (
        <div className={styles.itemSummary}>
          <div className={styles.itemImage}>
            <img src={itemData.image} alt={itemData.title} />
          </div>
          <div className={styles.itemDetails}>
            <h3>{itemData.title}</h3>
            <p className={styles.price}>₹{formData.price.toLocaleString()}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Travel Date *</label>
            <input
              type="date"
              value={formData.travelDate}
              onChange={(e) => handleInputChange('travelDate', e.target.value)}
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
          <label>Phone Number *</label>
          <input
            type="tel"
            value={formData.userPhone}
            onChange={(e) => handleInputChange('userPhone', e.target.value)}
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
            value={formData.pickupLocation}
            onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
            placeholder="Enter address"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Message</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
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

export default BookingForm;
