'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import styles from './AboutTaxiSection.module.css';

const AboutTaxiSection = () => {
  const stats = [
    {
      number: "13+",
      label: "Year Experience"
    },
    {
      number: "355+",
      label: "Destination Collaboration"
    },
    {
      number: "5K+",
      label: "Happy Customers"
    }
  ];

  const features = [
    "Reliable and punctual service with professional drivers.",
    "Transparent pricing, no hidden fees for your rides."
  ];

  return (
    <div className={styles.aboutWrapper}>
      {/* Decorative Background Elements */}
      <div className={styles.decorativeBg1} aria-hidden="true"></div>
      <div className={styles.decorativeBg2} aria-hidden="true"></div>

      <div className={styles.aboutContainer}>
        <div className={styles.aboutGrid}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.aboutImageWrapper}>
              <img
                src="/images/routes/aboutimage.jpg"
                alt="Online Taxi Service - Professional driver with mountain landscape view"
                className={styles.mainImage}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            <p className={styles.subtitle}>
              ABOUT ONLINE TAXI
            </p>

            <h1 className={styles.mainTitle}>
              Best Taxi Service Provide Since 2015.
            </h1>

            <p className={styles.description}>
              Online Taxi is a leading provider of seamless, reliable transportation services. With our innovative
              platform and commitment to customer satisfaction, we strive to make every trip a memorable experience.
              Explore our wide range of services and discover the convenience of on-demand mobility at your fingertips.
            </p>

            {/* Features List */}
            <div className={styles.featuresList}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <CheckCircle size={20} className={styles.checkIcon} />
                  <span className={styles.featureText}>{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className={styles.statsContainer}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.statItem}>
                  <span className={styles.statNumber}>{stat.number}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTaxiSection;