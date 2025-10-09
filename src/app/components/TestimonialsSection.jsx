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

        const fallbackAvatars = ["👩‍⚕️", "👨‍💼", "👩‍💻", "👨‍💻", "👤", "🧑‍✈️", "👩‍🎓"];
        const fallbackGradientColors = [
          "linear-gradient(135deg, #10b981, #059669)",
          "linear-gradient(135deg, #3b82f6, #1d4ed8)",
          "linear-gradient(135deg, #a855f7, #ec4899)",
          "linear-gradient(135deg, #f59e0b, #dc2626)",
          "linear-gradient(135deg, #2563eb, #9333ea)"
        ];
        const fallbackTourImages = ["🏔️🚗", "🏙️🚙", "🏖️🚗", "🛡️👨‍✈️", "🌄🚕", "🚐🌅"];

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
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/?scrollTo=booking');
    }
  };

  const LoadingComponent = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
      </div>
      <p className={styles.loadingText}>Loading testimonials...</p>
    </div>
  );

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

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

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
                  <div className={styles.quoteIcon}>🚕</div>

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
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
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

        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <LoadingComponent />
        ) : testimonials.length === 0 ? (
          <NoReviewsComponent />
        ) : (
          <>
            {/* Combined Testimonial Card */}
            <div className={styles.testimonialCard}>
              <div className={styles.quoteIcon} style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚕</div>

              <div className={styles.userInfo} style={{ alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
                <div className={styles.avatar} style={{ width: '5rem', height: '5rem', fontSize: '2.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  {testimonials[currentTestimonial]?.avatar}
                </div>
                <div>
                  <h3 className={styles.userName} style={{ marginBottom: '0.25rem' }}>
                    {testimonials[currentTestimonial]?.name}
                  </h3>
                  <p className={styles.userRole} style={{ marginTop: 0, fontStyle: 'italic', color: '#666' }}>
                    {testimonials[currentTestimonial]?.role}
                  </p>
                  <div className={styles.stars} style={{ marginTop: '0.5rem' }}>
                    {renderStars(testimonials[currentTestimonial]?.rating)}
                  </div>
                </div>
              </div>

              <p className={styles.testimonialText} style={{ marginTop: '1.5rem', fontSize: '1.25rem', textAlign: 'center', fontStyle: 'italic', color: '#333' }}>
                "{testimonials[currentTestimonial]?.text || "Great service!"}"
              </p>
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