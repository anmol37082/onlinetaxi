"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from './toproutes.module.css';
import TermsConditions from '../../components/TermsConditions';

const RouteDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const fetchRoute = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/toproutes?slug=${encodeURIComponent(slug)}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to fetch route: ${res.status} ${res.statusText} - ${errorData.error || ''}`);
      }

      const data = await res.json();

      if (!data.toproute) {
        throw new Error("Route not found");
      }

      setRoute(data.toproute);
    } catch (err) {
      console.error("Error fetching route:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (original, current) => {
    if (!original || !current || original <= current) return null;
    return original - current;
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
          }}>Loading your route details...</p>
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
          <Link href="/routes" className={styles.viewAllBtn}>
            🏠 Back to Routes
          </Link>
        </div>
      </div>
    </div>
  );

  // Enhanced Info Section Component
  const InfoSection = ({ heading, content, children, icon = "📄" }) => {
    if (!heading || (!content && !children)) return null;
    
    return (
      <section className={styles.infoSection}>
        <h2 className={styles.heading}>
          <span style={{ marginRight: '0.5rem' }}>{icon}</span>
          {heading}
        </h2>
        {content && <p className={styles.paragraph}>{content}</p>}
        {children}
      </section>
    );
  };

  // Enhanced List Component
  const ListSection = ({ heading, items, icon = "📝" }) => {
    if (!heading || !items || items.length === 0) return null;
    
    return (
      <InfoSection heading={heading} icon={icon}>
        <ul className={styles.list}>
          {items.map((item, idx) => (
            <li key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>{item}</li>
          ))}
        </ul>
      </InfoSection>
    );
  };

  if (loading) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <ErrorMessage message={error} onRetry={fetchRoute} />
        </div>
      </section>
    );
  }

  if (!route) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <h2>Route Not Found</h2>
              <p>The route you're looking for doesn't exist or has been removed.</p>
              <Link href="/routes" className={styles.viewAllBtn}>
                🏠 Back to Routes
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const savings = calculateSavings(route.originalPrice, route.currentPrice);

  return (
    <section className={styles.routesSection}>
      <div className={styles.container}>
        {/* Enhanced Navigation */}
        <Link href="/routes" className={styles.viewAllBtn}>
          <span>←</span> Back to Routes
        </Link>

        {/* Route Title with Animation */}
        <h1 className={styles.sectionTitle} style={{ animationDelay: '0.2s' }}>
          {route.title}
        </h1>

        {/* Enhanced Route Image */}
        <div className={styles.cardImageContainer} style={{ animationDelay: '0.3s' }}>
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
            src={imageError ? "/api/placeholder/600/400" : (route.image || "/api/placeholder/600/400")}
            alt={route.imageAlt || route.title}
            width={600}
            height={400}
            className={styles.routeImage}
            priority
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoading ? 0.3 : 1 }}
          />
        </div>

        {/* Enhanced Route Description */}
        {route.description && (
          <p className={styles.routeDescription} style={{ animationDelay: '0.4s' }}>
            {route.description}
          </p>
        )}

        {/* Enhanced Route Information */}
        <div className={styles.routeInfo} style={{ animationDelay: '0.5s' }}>
          {route.fromCity && (
            <p><strong>🏁 From:</strong> {route.fromCity}</p>
          )}
          {route.toCity && (
            <p><strong>🎯 To:</strong> {route.toCity}</p>
          )}
          {route.distance && (
            <p><strong>📏 Distance:</strong> {route.distance}</p>
          )}
          {route.duration && (
            <p><strong>⏱️ Duration:</strong> {route.duration}</p>
          )}
          {route.carType && (
            <p><strong>🚗 Vehicle:</strong> {route.carType}</p>
          )}
          {route.discount && (
            <p><strong>🎉 Discount:</strong> 
              <span style={{ 
                color: 'rgba(255, 107, 53, 0.9)',
                fontWeight: '700',
                marginLeft: '0.5rem'
              }}>
                {route.discount}% OFF
              </span>
            </p>
          )}
          
          {/* Enhanced Price Display - NO BLUR */}
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
          {/* Floating price decoration */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(45deg, rgba(255, 107, 53, 0.2), rgba(255, 140, 66, 0.1))',
            borderRadius: '50%',
            animation: 'floatElement 6s ease-in-out infinite',
            zIndex: '0'
          }}></div>
          
          <p style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#ff6b35',
            margin: '0 0 0.5rem 0',
            position: 'relative',
            zIndex: '2'
          }}>
            {formatPrice(route.currentPrice)}
          </p>
          {route.originalPrice && route.originalPrice > route.currentPrice && (
            <div>
              <del style={{ 
                color: 'rgba(184, 167, 148, 0.8)', 
                fontSize: '1.3rem',
                textDecorationColor: 'rgba(255, 107, 53, 0.5)'
              }}>
                {formatPrice(route.originalPrice)}
              </del>
              {savings && (
                <span style={{
                  marginLeft: '1rem',
                  color: 'rgba(255, 107, 53, 0.9)',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  padding: '0.3rem 0.8rem',
                  background: 'rgba(255, 107, 53, 0.1)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 107, 53, 0.2)'
                }}>
                  💰 Save: ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          )}
        </div>
        </div>

        {/* Enhanced Features */}
        {route.features && route.features.length > 0 && (
          <div className={styles.routeFeaturesList} style={{ animationDelay: '0.6s' }}>
            <h3 className={styles.featuresTitle}>✨ Included Features</h3>
            <ul>
              {route.features.map((feature, idx) => (
                <li key={idx} style={{ animationDelay: `${0.7 + idx * 0.1}s` }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dynamic Info Sections with Icons */}
        <InfoSection 
          heading={route.introHeading} 
          content={route.introParagraph}
          icon="🚀"
        />

        <InfoSection 
          heading={route.overviewHeading} 
          content={route.overviewParagraph}
          icon="🗺️"
        />

        <InfoSection 
          heading={route.aboutHeading} 
          content={route.aboutParagraph}
          icon="ℹ️"
        />

        <InfoSection 
          heading={route.journeyHeading} 
          content={route.journeyParagraph}
          icon="🛣️"
        />

        <InfoSection 
          heading={route.destinationHeading} 
          content={route.destinationParagraph}
          icon="📍"
        />

        {/* Enhanced Lists with Icons */}
        <ListSection 
          heading="Sightseeing Highlights" 
          items={route.sightseeing}
          icon="🏛️"
        />

        <ListSection 
          heading={route.whyHeading || "Why Choose This Route"} 
          items={route.whyPoints}
          icon="⭐"
        />

        <InfoSection 
          heading={route.discoverHeading} 
          content={route.discoverParagraph}
          icon="🔍"
        />

        <ListSection 
          heading="Top Attractions" 
          items={route.attractions}
          icon="🎯"
        />

        <InfoSection 
          heading={route.bookingHeading} 
          content={route.bookingParagraph}
          icon="📞"
        />

      

        {/* Terms and Conditions Section */}
        <TermsConditions />
      </div>

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
        
        @keyframes floatElement {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
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

export default RouteDetailPage;