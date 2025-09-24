"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
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
          
          {/* Contact Info Grid */}
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Phone size={20} />
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactLabel}>Call Us</div>
                <div className={styles.contactValue}>+91 9988-2222-83</div>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Mail size={20} />
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactLabel}>Email Us</div>
                <div className={styles.contactValue}>onlinetaxi09@gmail.com</div>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <MapPin size={20} />
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactLabel}>Visit Us</div>
                <div className={styles.contactValue}>Sector 68, Mohali</div>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.contactText}>
                <div className={styles.contactLabel}>Available</div>
                <div className={styles.contactValue}>24/7 Service</div>
              </div>
            </div>
          </div>

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