"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from './tours.module.css';
import TermsConditions from '../../components/TermsConditions';
import BookingForm from '../../components/BookingForm';
import EnhancedFooter from '../../components/footer';

const TourDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchTour = useCallback(async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/tours?slug=${encodeURIComponent(slug)}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to fetch tour: ${res.status} ${res.statusText} - ${errorData.error || ''}`);
      }
      
      const data = await res.json();
      
      if (!data.tour) {
        throw new Error("Tour not found");
      }
      
      setTour(data.tour);
    } catch (err) {
      console.error("Error fetching tour:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Enhanced Loading Component
  const LoadingSpinner = () => (
    <div className={styles.loadingState}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem',
        position: 'relative'
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
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            border: '3px solid rgba(255, 140, 66, 0.1)',
            borderRight: '3px solid rgba(255, 140, 66, 0.6)',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite reverse',
            top: '0',
            left: '0'
          }}></div>
        </div>
        <div style={{
          background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.1), rgba(255, 140, 66, 0.1))',
          padding: '1rem 2rem',
          borderRadius: '25px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <p style={{
            margin: 0,
            color: 'rgba(255, 107, 53, 0.9)',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>Loading your tour details...</p>
        </div>
      </div>
    </div>
  );

  // Enhanced Error Component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className={styles.errorState}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem' 
      }}>
        <div style={{ 
          fontSize: '3rem', 
          color: 'rgba(255, 107, 53, 0.6)', 
          marginBottom: '1rem' 
        }}>🚫</div>
        <h2 style={{ 
          color: 'rgba(31, 41, 55, 0.9)', 
          marginBottom: '0.5rem' 
        }}>Oops! Something went wrong</h2>
        <p style={{ 
          color: 'rgba(75, 85, 99, 0.8)', 
          marginBottom: '2rem' 
        }}>Error: {message}</p>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap' 
        }}>
          <button
            onClick={onRetry}
            style={{ 
              padding: '1rem 2rem', 
              background: '#ffb938', 
              color: 'white', 
              border: 'none', 
              borderRadius: '25px', 
              cursor: 'pointer', 
              fontWeight: '600', 
              fontSize: '1rem', 
              transition: 'all 0.3s ease', 
              boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)' 
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 53, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.3)';
            }}
          >
            🔄 Try Again
          </button>
          <Link href="/" className={styles.backLink}>
            🏠 Back to Tours
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className={styles.tourSection}>
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.tourSection}>
        <div className={styles.container}>
          <ErrorMessage message={error} onRetry={fetchTour} />
        </div>
      </section>
    );
  }

  if (!tour) {
    return (
      <section className={styles.tourSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1.5rem' 
            }}>
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <h2>Tour Not Found</h2>
              <p>The tour you're looking for doesn't exist or has been removed.</p>
              <Link href="/" className={styles.backLink}>
                🏠 Back to Tours
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.tourSection}>
      <div className={styles.container}>
        {/* Enhanced Navigation */}
        <Link href="/" className={styles.backLink}>
          <span>←</span> Back to Tours
        </Link>

        {/* Tour Title with Animation */}
        <h1 className={styles.title} style={{ animationDelay: '0.2s' }}>
          {tour.title}
        </h1>

        {/* Enhanced Tour Image */}
        <div className={styles.imageContainer} style={{ animationDelay: '0.3s' }}>
          {imageLoading && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              zIndex: 2, 
              background: 'rgba(255, 255, 255, 0.9)', 
              padding: '2rem', 
              borderRadius: '15px' 
            }}>
              <LoadingSpinner />
            </div>
          )}
          <Image
            src={imageError ? "/api/placeholder/600/400" : (tour.image || "/api/placeholder/600/400")}
            alt={tour.title}
            width={600}
            height={400}
            className={styles.image}
            priority
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoading ? 0.3 : 1 }}
          />
        </div>

        {/* Enhanced Description */}
        {tour.description && (
          <p className={styles.description} style={{ animationDelay: '0.4s' }}>
            {tour.description}
          </p>
        )}

        {/* Tour Details Card */}
        <div className={styles.tourDetailsCard} style={{ animationDelay: '0.45s' }}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>⏱️</span>
              <div>
                <strong>Duration:</strong>
                <p>{tour.duration}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>💰</span>
              <div>
                <strong>Price:</strong>
                <p>₹{tour.price}</p>
              </div>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>🏷️</span>
              <div>
                <strong>Category:</strong>
                <p>{tour.tag}</p>
              </div>
            </div>
            {tour.rating && (
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>⭐</span>
                <div>
                  <strong>Rating:</strong>
                  <p>{tour.rating}/5</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Summary Section */}
        {tour.summaryTitle && (
          <div className={styles.summarySection} style={{ animationDelay: '0.5s' }}>
            <h2 className={styles.sectionTitle}>
              <span style={{ marginRight: '0.5rem' }}>📋</span>
              {tour.summaryTitle}
            </h2>
            <p className={styles.sectionContent}>{tour.summaryText}</p>
          </div>
        )}

        {/* Enhanced Travel Tips */}
        {tour.travelTipsTitle && tour.travelTips && tour.travelTips.length > 0 && (
          <div className={styles.travelTipsSection} style={{ animationDelay: '0.6s' }}>
            <h2 className={styles.sectionTitle}>
              <span style={{ marginRight: '0.5rem' }}>💡</span>
              {tour.travelTipsTitle}
            </h2>
            <ul className={styles.travelTipsList}>
              {tour.travelTips.map((tip, idx) => (
                <li key={idx} style={{ animationDelay: `${0.7 + idx * 0.1}s` }}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Enhanced Itinerary */}
        {tour.days && tour.days.length > 0 && (
          <div className={styles.itinerarySection} style={{ animationDelay: '0.7s' }}>
            <h2 className={styles.sectionTitle}>
              <span style={{ marginRight: '0.5rem' }}>🗓️</span>
              Itinerary
            </h2>
            {tour.days.map((day, idx) => (
              <div key={idx} className={styles.daySection} style={{ animationDelay: `${0.8 + idx * 0.1}s` }}>
                <h3 className={styles.dayTitle}>{day.dayTitle}</h3>
                <div className={styles.dayActivities}>
                  <div className={styles.activity}>
                    <span className={styles.activityIcon}>🌅</span>
                    <strong>Morning:</strong> {day.morning}
                  </div>
                  <div className={styles.activity}>
                    <span className={styles.activityIcon}>☀️</span>
                    <strong>Afternoon:</strong> {day.afternoon}
                  </div>
                  <div className={styles.activity}>
                    <span className={styles.activityIcon}>🌆</span>
                    <strong>Evening:</strong> {day.evening}
                  </div>
                  <div className={styles.activity}>
                    <span className={styles.activityIcon}>🌙</span>
                    <strong>Night:</strong> {day.night}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Closing */}
        {tour.closingParagraph && (
          <p className={styles.closingParagraph} style={{ animationDelay: '0.9s' }}>
            {tour.closingParagraph}
          </p>
        )}

        {/* Book Now Button and Booking Form Modal */}
        <div style={{
          textAlign: 'center',
          margin: '2rem 0',
          animationDelay: '0.95s'
        }}>
          <button
            onClick={() => setShowBookingForm(true)}
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
              🏛️ Book Tour Now
            </span>
          </button>
        </div>

        {/* Terms and Conditions */}
        <TermsConditions />
      </div>

      {/* Footer */}
      <EnhancedFooter />

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
            bookingType="tour"
            itemData={tour}
            onClose={() => setShowBookingForm(false)}
          />
        </div>
      )}

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default TourDetailPage;
