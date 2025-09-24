"use client";
import React from "react";
import styles from "./privacy-policy.module.css";

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.effectiveDate}>
            <strong>Effective Date:</strong> 24/09/2025
          </p>
        </header>

        <main className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.text}>
              We may collect your name, mobile number, email, and address when you
              book a ride. This information is only used to provide taxi booking
              and related services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>To confirm bookings and provide our services.</li>
              <li className={styles.listItem}>To contact you regarding your ride.</li>
              <li className={styles.listItem}>
                We <strong>do not sell or share</strong> your information with any
                third party.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Security</h2>
            <p className={styles.text}>
              We take appropriate steps to keep your information safe. If online
              payments are enabled, they are always processed through secure
              gateways.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Cookies</h2>
            <p className={styles.text}>
              Our website may use cookies to improve your browsing experience. You
              may disable cookies in your browser if you prefer.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Changes to This Policy</h2>
            <p className={styles.text}>
              We may update this Privacy Policy from time to time. The updated
              version will always be available on our website/app.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Contact Us</h2>
            <p className={styles.text}>
              If you have any questions about this Privacy Policy, please contact
              us:
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📧</span>
                <span>Email: </span>
                <a
                  href="mailto:onlinetaxi09@gmail.com"
                  className={styles.contactLink}
                >
                  onlinetaxi09@gmail.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>Phone: +91 9988-2222-83</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}