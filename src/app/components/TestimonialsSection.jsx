"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './TestimonialsSection.module.css';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200);
  const [isClient, setIsClient] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        const reviews = data.reviews || [];

        // Arrays of fallback values for random assignment
        const fallbackAvatars = ["👩‍⚕️", "👨‍💼", "👩‍💻", "👨‍💻", "👤", "🧑‍✈️", "👩‍🎓"];
        const fallbackGradientColors = [
          "linear-gradient(135deg, #10b981, #059669)",
          "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          "linear-gradient(135deg, #a855f7, #ec4899)",
          "linear-gradient(135deg, #f59e0b, #dc2626)",
          "linear-gradient(135deg, #2563eb, #9333ea)"
        ];
        const fallbackTourImages = ["🏔️🚗", "🏙️🚙", "🏖️🚗", "🛡️👨‍✈️", "🌄🚕", "🚐🌅"];

        // Transform reviews to match the expected format with random fallback assignment
        const formattedTestimonials = reviews.map((review, index) => ({
          id: review._id,
          name: review.name,
          role: review.role,
          avatar: review.avatar || fallbackAvatars[index % fallbackAvatars.length],
          rating: review.rating,
          text: review.text,
          gradientColor: review.gradientColor || fallbackGradientColors[index % fallbackGradientColors.length],
          tourImage: review.tourImage || fallbackTourImages[index % fallbackTourImages.length],
          tourType: review.tourType,
          tourDescription: review.tourDescription
        }));
        setTestimonials(formattedTestimonials);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        // Set empty testimonials array on error - don't show fallback data
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const stats = [
    { icon: "👥", value: "500+", label: "Happy Customers" },
    { icon: "👍", value: "98%", label: "Satisfaction Rate" },
    { icon: "🏆", value: "50+", label: "Awards Won" }
  ];

  // Check screen size
  useEffect(() => {
    setIsClient(true);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setScreenWidth(window.innerWidth);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentTestimonial, testimonials.length]);

  const nextTestimonial = () => {
    if (!isAnimating && testimonials.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating && testimonials.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        style={{
          fontSize: isClient && isMobile ? '1rem' : '1.25rem',
          color: i < rating ? '#fbbf24' : '#d1d5db'
        }}
      >
        ⭐
      </span>
    ));
  };

  const handleBookNowClick = (e) => {
    e.preventDefault();
    if (pathname === '/') {
      // On home page, scroll to booking section
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, navigate to home with scrollTo param
      router.push('/?scrollTo=booking');
    }
  };

  // Loading Component
  const LoadingComponent = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.loadingText}>Loading testimonials...</p>
    </div>
  );

  // No Reviews Component
  const NoReviewsComponent = () => (
    <div className={styles.noReviewsContainer}>
      <div className={styles.noReviewsIcon}>📝</div>
      <h3 className={styles.noReviewsTitle}>No Reviews Yet</h3>
      <p className={styles.noReviewsText}>
        Be the first to share your experience with our service!
      </p>
      <button className={styles.ctaButton} style={{ marginTop: '1rem' }} onClick={handleBookNowClick}>
        <span>📞</span>
        Book Your Ride Now
      </button>
    </div>
  );

  if (pathname === '/reviews') {
    return (
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.badge}>
              <span>🏆</span>
              ALL REVIEWS & TESTIMONIALS
            </div>

            <h1 className={styles.mainTitle}>
              What Our{' '}
              <span className={styles.gradientText}>
                Customers Are
              </span>
              {!isMobile && <br />}
              {isMobile ? ' ' : ''}
              Saying About Us
            </h1>

            <p className={styles.subtitle}>
              Our customers rave about the outstanding service, reliable transportation, and seamless
              booking experience we provide. Here's what they have to say:
            </p>
          </div>

          {/* Stats Section */}
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className={styles.statCard}
              >
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Loading, No Reviews, or All Testimonials Grid */}
          {loading ? (
            <LoadingComponent />
          ) : testimonials.length === 0 ? (
            <NoReviewsComponent />
          ) : (
            <div className={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`${styles.testimonialCard} ${isMobile ? styles.mobileTestimonialCard : ''}`}
                  style={{ height: 'auto' }}
                >
                  <div className={styles.quoteIcon}>💬</div>

                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h3 className={styles.userName}>
                        {testimonial.name}
                      </h3>
                      <p className={styles.userRole}>{testimonial.role}</p>
                    </div>
                  </div>

                  <div className={styles.stars}>
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className={styles.testimonialText}>
                    "{testimonial.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.badge}>
            <span>🏆</span>
            REVIEWS & TESTIMONIALS
          </div>

          <h1 className={styles.mainTitle}>
            What Our{' '}
            <span className={styles.gradientText}>
              Customers Are
            </span>
            {!isMobile && <br />}
            {isMobile ? ' ' : ''}
            Saying About Us
          </h1>

          <p className={styles.subtitle}>
            Our customers rave about the outstanding service, reliable transportation, and seamless
            booking experience we provide. Here's what they have to say:
          </p>
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={styles.statCard}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Loading, No Reviews, or Main Testimonial Section */}
        {loading ? (
          <LoadingComponent />
        ) : testimonials.length === 0 ? (
          <NoReviewsComponent />
        ) : (
          <>
            {/* Main Testimonial Section */}
            <div className={styles.testimonialSection}>
              {/* Tour Image Section - Dynamic tour visuals */}
              <div className={styles.imageSection}>
                  <div style={{
                    background: testimonials[currentTestimonial]?.gradientColor || "linear-gradient(135deg, #10b981, #059669)"
                  }} className={styles.tourImageContainer}>
                    <div className={styles.overlayPattern}></div>

                    {/* Main Tour Image/Icon */}
                    <div className={styles.tourImageIcon}>
                      {testimonials[currentTestimonial]?.tourImage || "🏔️🚗"}
                    </div>

                    {/* Tour Information */}
                    <h3 className={styles.tourTitle}>
                      {testimonials[currentTestimonial]?.tourType || ""}
                    </h3>

                    <p className={styles.tourDescription}>
                      {testimonials[currentTestimonial]?.tourDescription || ""}
                    </p>

                    {/* Customer Avatar Indicators - Centered */}
                    <div style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }}>
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        style={{
                          width: isMobile ? '2rem' : '2.5rem',
                          height: isMobile ? '2rem' : '2.5rem',
                          borderRadius: '50%',
                          background: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '1rem' : '1.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          transform: index === currentTestimonial ? 'scale(1.2)' : 'scale(0.9)',
                          opacity: index === currentTestimonial ? '1' : '0.7',
                          border: index === currentTestimonial ? '3px solid white' : '2px solid rgba(255,255,255,0.5)'
                        }}
                        onClick={() => setCurrentTestimonial(index)}
                        onMouseEnter={(e) => (!isClient || !isMobile) && (e.currentTarget.style.transform = 'scale(1.1)')}
                        onMouseLeave={(e) => (!isClient || !isMobile) && (e.currentTarget.style.transform = index === currentTestimonial ? 'scale(1.2)' : 'scale(0.9)')}
                      >
                        {testimonial.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Card */}
              <div>
                <div className={`${styles.testimonialCard} ${isMobile ? styles.mobileTestimonialCard : ''}`}>
                  <div>
                    <div className={styles.quoteIcon}>💬</div>

                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {testimonials[currentTestimonial]?.avatar }
                      </div>
                      <div>
                        <h3 className={styles.userName}>
                          {testimonials[currentTestimonial]?.name }
                        </h3>
                        <p className={styles.userRole}>{testimonials[currentTestimonial]?.role }</p>
                      </div>
                    </div>

                    <div className={styles.stars}>
                      {renderStars(testimonials[currentTestimonial]?.rating )}
                    </div>

                    <p className={styles.testimonialText}>
                      "{testimonials[currentTestimonial]?.text || "Great service!"}"
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                  <button
                    className={styles.navButton}
                    onClick={prevTestimonial}
                    disabled={isAnimating}
                  >
                    ‹
                  </button>

                  <div className={styles.dots}>
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.dot} ${index === currentTestimonial ? styles.activeDot : styles.inactiveDot}`}
                        onClick={() => setCurrentTestimonial(index)}
                      />
                    ))}
                  </div>

                  <button
                    className={styles.navButton}
                    onClick={nextTestimonial}
                    disabled={isAnimating}
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
              <button className={styles.ctaButton} onClick={handleBookNowClick}>
                <span>📞</span>
                Book Your Ride Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;