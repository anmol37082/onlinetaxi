"use client";

import React, { useState, useEffect } from 'react';
import styles from './EnhancedBanner.module.css';
import { Star, MapPin, Clock, Users, Award, Shield } from 'lucide-react';

const EnhancedBanner = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentJourneyText, setCurrentJourneyText] = useState(0);

  const journeyTexts = [
    "Every Mile is a Memory",
    "Your Journey Starts Here",
    "Comfort Meets Adventure", 
    "Safe Roads, Happy Hearts",
    "Making Distance Disappear"
  ];

  useEffect(() => {
    setIsClient(true);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Auto-rotate journey text
    const textInterval = setInterval(() => {
      setCurrentJourneyText((prev) => (prev + 1) % journeyTexts.length);
    }, 3000);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearInterval(textInterval);
    };
  }, []);

  const stats = [
    { icon: Star, value: "4.9", label: "Rating", color: "#fbbf24" },
    { icon: MapPin, value: "50+", label: "Cities", color: "#10b981" },
    { icon: Clock, value: "24/7", label: "Service", color: "#3b82f6" },
    { icon: Users, value: "500+", label: "Happy Rides", color: "#8b5cf6" }
  ];

  const features = [
    { icon: Shield, title: "Safe & Secure", description: "Professional drivers with verified credentials" },
    { icon: Award, title: "Premium Service", description: "Luxury vehicles with modern amenities" },
    { icon: Clock, title: "Always Available", description: "Round-the-clock service for your convenience" },
    { icon: Users, title: "Trusted by Thousands", description: "Join our family of satisfied customers" }
  ];

  return (
    <section className={styles.bannerSection}>
      {/* Background Overlay */}
      <div className={styles.overlay}></div>
      
      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.floatingCircle}></div>
        <div className={styles.geometricShape}></div>
        <div className={styles.gradientBlob}></div>
      </div>

      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.topContent}>
          <div className={styles.brandSection}>
            <span className={styles.brandTag}>ABOUT ONLINETAXI</span>
            <h1 className={styles.mainHeading}>
              Creating Memorable{' '}
              <span className={styles.highlight}>Journeys</span>
              <br />
              Across India
            </h1>
            
            {/* Dynamic Journey Text */}
            <div className={styles.journeyText}>
              "{journeyTexts[currentJourneyText]}"
            </div>
            
            <p className={styles.subtitle}>
              From bustling cityscapes to serene countryside, we connect you to every destination 
              with comfort, safety, and reliability. Your perfect ride awaits.
            </p>
          </div>

          <div className={styles.statsSection}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={styles.stat}>
                  <div className={styles.statIcon}>
                    <IconComponent size={isMobile ? 20 : 24} />
                  </div>
                  <div className={styles.statContent}>
                    <span className={styles.statNumber}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <IconComponent size={28} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
       
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollDot}></div>
      </div>
    </section>
  );
};

export default EnhancedBanner;