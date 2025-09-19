"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react";
import styles from "./EnhancedContactSection.module.css";

const EnhancedContactSection = () => {
  return (
    <section className={styles.contactSection}>
      {/* Animated Background Elements */}
      <div className={styles.floatingElement1}></div>
      <div className={styles.floatingElement2}></div>
      <div className={styles.floatingElement3}></div>
      
      <div className={styles.container}>
        {/* Left Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/contact/taxi-road.jpg"
                alt="Taxi on Road"
                width={600}
                height={400}
                className={styles.contactImage}
                priority
              />
            </div>
            <div className={styles.imageOverlay}></div>
          </div>
        </div>

        {/* Right Content Section */}
        <div className={styles.contentSection}>
          <div className={styles.headerText}>
            <span className={styles.subtitle}>TALK TO US</span>
            <h2 className={styles.mainTitle}>
              Get in Touch With <span className={styles.titleHighlight}>Us</span>
            </h2>
            <p className={styles.description}>
              We'd love to hear from you! Whether you have a question, a booking request, or any 
              other inquiry, please fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>CONTACT INFO</h3>
            
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <Mail className={styles.contactIcon} size={20} />
                </div>
                <span className={styles.contactText}>onlinetaxi09@gmail.com</span>
              </div>
              
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <Phone className={styles.contactIcon} size={20} />
                </div>
                <span className={styles.contactText}>+91 9988-2222-83</span>
              </div>
              
              <div className={styles.contactItem}>
                <div className={styles.iconWrapper}>
                  <MapPin className={styles.contactIcon} size={20} />
                </div>
                <span className={styles.contactText}>Online Taxi, Sector 68, Mohali</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.socialSection}>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedContactSection;