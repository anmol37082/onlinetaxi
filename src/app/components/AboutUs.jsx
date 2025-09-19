// components/AboutUs.js
import React from 'react';
import styles from './AboutUs.module.css';
import { FaCar, FaUserTie, FaRoute, FaPhone } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <section className={styles.aboutSection}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle}></div>
        <div className={styles.triangle}></div>
        <div className={styles.dots}></div>
      </div>

      <div className={styles.container}>
        {/* Left Content */}
        <div className={styles.content}>
          <div className={styles.breadcrumb}>
            <span>Home</span>
            <span className={styles.separator}>-</span>
            <span className={styles.active}>About</span>
          </div>

          <div className={styles.tagline}>
            Explore the world!
          </div>

          <h1 className={styles.title}>About Us</h1>

          <p className={styles.description}>
            Providing exceptional taxi and chauffeur services across India since 
            2015. Committed to offering a seamless, comfortable, and stress-free 
            travel experience for all our customers.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <FaCar className={styles.icon} />
              <span>Premium Fleet</span>
            </div>
            <div className={styles.feature}>
              <FaUserTie className={styles.icon} />
              <span>Professional Drivers</span>
            </div>
            <div className={styles.feature}>
              <FaRoute className={styles.icon} />
              <span>Pan-India Service</span>
            </div>
          </div>

          <button className={styles.ctaButton}>
            Get Started Today
          </button>
        </div>

        {/* Right Illustration */}
        <div className={styles.illustration}>
          <div className={styles.carCard}>
            <FaCar className={styles.carIcon} />
            <div className={styles.cardContent}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
            </div>
          </div>

          <div className={styles.characters}>
            <div className={styles.driver}>
              <div className={styles.person}>
                <div className={styles.head}></div>
                <div className={styles.body}></div>
                <div className={styles.legs}></div>
              </div>
            </div>
            <div className={styles.customer}>
              <div className={styles.person}>
                <div className={styles.head}></div>
                <div className={styles.body}></div>
                <div className={styles.legs}></div>
              </div>
            </div>
          </div>

          <div className={styles.car}>
            <div className={styles.carBody}></div>
            <div className={styles.wheel}></div>
            <div className={styles.wheel}></div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutUs;
