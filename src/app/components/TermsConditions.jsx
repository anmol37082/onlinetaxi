"use client";

import React from "react";
import styles from './terms-conditions.module.css';

const TermsConditions = () => {
  const includedServices = [
    "Pick up & Drop",
    "Sightseeing by car",
    "Transfers: Destination-Hotel-Destination",
    "Sightseeing as per tour itinerary",
    "All Toll and driver charges included",
    "Inclusive of all taxes"
  ];

  const excludedServices = [
    "Personal expenses like shopping",
    "Entry fees at monuments or museums", 
    "Meals other than specified",
    "Guide charges",
    "Airfare or train tickets"
  ];

  return (
    <section className={styles.termsSection}>
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.brandName}>Online Taxi</div>
          <h1 className={styles.mainTitle}>Terms & Conditions</h1>
        </div>

        {/* Terms Content */}
        <div className={styles.termsContent}>
          {/* Included Services */}
          <div className={styles.serviceSection} style={{ animationDelay: '0.2s' }}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>✅</span>
              What's Included
            </h2>
            <ul className={styles.serviceList}>
              {includedServices.map((service, index) => (
                <li 
                  key={index} 
                  className={styles.includedItem}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <span className={styles.checkIcon}>✓</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Excluded Services */}
          <div className={styles.serviceSection} style={{ animationDelay: '0.4s' }}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>❌</span>
              What's Not Included
            </h2>
            <ul className={styles.serviceList}>
              {excludedServices.map((service, index) => (
                <li 
                  key={index} 
                  className={styles.excludedItem}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <span className={styles.crossIcon}>✗</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Terms */}
          <div className={styles.additionalTerms} style={{ animationDelay: '0.6s' }}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleIcon}>📋</span>
              Important Terms
            </h2>
            <div className={styles.termsList}>
              <div className={styles.termItem}>
                <h3 className={styles.termTitle}>🕐 Booking & Cancellation</h3>
                <p className={styles.termText}>
                  Advance booking recommended. Cancellation charges may apply based on timing.
                </p>
              </div>
              <div className={styles.termItem}>
                <h3 className={styles.termTitle}>💳 Payment Terms</h3>
                <p className={styles.termText}>
                  Payment can be made via cash, card, or online transfer. Full payment required for advance bookings.
                </p>
              </div>
              <div className={styles.termItem}>
                <h3 className={styles.termTitle}>🚗 Vehicle Conditions</h3>
                <p className={styles.termText}>
                  All vehicles are well-maintained, insured, and driven by licensed, experienced drivers.
                </p>
              </div>
              <div className={styles.termItem}>
                <h3 className={styles.termTitle}>⏰ Waiting Time</h3>
                <p className={styles.termText}>
                  Complimentary waiting time is 15 minutes. Additional charges apply for extended waiting.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
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
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
};

export default TermsConditions;