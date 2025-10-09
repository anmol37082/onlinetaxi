"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import styles from "./ContactSection.module.css";

const ContactSection = () => {
  return (
    <section className={styles.contactSection}>
      {/* Floating Background Elements */}
      <div className={styles.floatingElements}></div>
      <div className={styles.floatingElements}></div>
      
      <div className={styles.container}>
        {/* Left Content */}
        <div className={styles.textContent}>
          <span className={styles.subtitle}>Get In Touch!</span>
          <h2 className={styles.heading}>Contact Us</h2>
          <p className={styles.description}>
            For any inquiries or assistance, please don&apos;t hesitate to reach
            out to us. We&apos;re here to help you with all your transportation needs!
          </p>
          


          <div className={styles.breadcrumb}>
            <a href="/">Home</a>
            <ArrowRight size={16} />
            <span className={styles.breadcrumbCurrent}>Contact</span>
          </div>
        </div>

        {/* Right Image */}
        <div className={styles.imageWrapper}>
          <div className={styles.imageContainer}>
            <Image
              src="/images/contact/undraw_contact-us_kcoa.svg"
              alt="Contact Illustration"
              width={500}
              height={400}
              className={styles.contactImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;