"use client";

import React, { useState } from "react";
import BookingForm from './BookingForm';

const BookNowButton = ({ itemData, bookingType = "route", buttonText = "🚗 Book Now" }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  return (
    <>
      <div style={{
        textAlign: 'center',
        margin: '2rem 0',
        animationDelay: '0.55s'
      }}>
        <button
          onClick={handleBookNow}
          style={{
            padding: '1rem 3rem',
            background: 'linear-gradient(45deg, #ff6b35, #ffb938)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.4)';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {buttonText}
          </span>
        </button>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <BookingForm
            bookingType={bookingType}
            itemData={itemData}
            onClose={() => setShowBookingForm(false)}
          />
        </div>
      )}
    </>
  );
};

export default BookNowButton;
