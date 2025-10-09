
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Star, Car, Shield, Users, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import styles from './footer.module.css';

const EnhancedFooter = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };

    checkScreenSize();
  }, []);

  const handleBookNowClick = () => {
    if (pathname === '/') {
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/?scrollTo=booking');
    }
  };

  const handleOurServicesClick = () => {
    if (pathname === '/') {
      const taxiServicesSection = document.getElementById('taxi-services');
      if (taxiServicesSection) {
        taxiServicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/?scrollTo=taxi-services');
    }
  };

  const footerData = {
    company: {
      name: "OnlineTaxi",
      tagline: "Reliable and Convenient Online Taxi Services",
      description: "Serving Cities Across India | Book Your Rides with Ease. Professional drivers, clean vehicles, and 24/7 customer support.",
      stats: [
        { icon: Car, value: "500+", label: "Happy Rides" },
        { icon: Users, value: "98%", label: "Satisfaction" },
        { icon: Shield, value: "24/7", label: "Support" },
        { icon: Star, value: "4.9", label: "Rating" }
      ]
    },
    quickLinks: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Our Services.", href: "/services" },
      { name: "Book Now", href: "/book" },
      { name: "Reviews", href: "/reviews" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" }
    ],
    services: [
      { name: "Airport Transfer", description: "Reliable airport pickup & drop" },
      { name: "City Tours", description: "Explore local attractions" },
      { name: "Business Travel", description: "Corporate transportation" },
      { name: "Wedding Services", description: "Special occasion transport" },
      { name: "Outstation Trips", description: "Long distance travel" },
      { name: "Emergency Rides", description: "24/7 emergency service" }
    ],
    contact: {
      phone: "+91 9988-2222-83",
      email: "onlinetaxi08@gmail.com",
      address: "Online Taxi, Sector 68, Mohali, Punjab",
      hours: "24/7 Available",
      socialMedia: [
        { name: "Facebook", icon: Facebook, href: "#", color: "#1877f2" },
        { name: "Instagram", icon: Instagram, href: "#", color: "#e4405f" },
        { name: "Twitter", icon: Twitter, href: "#", color: "#1da1f2" },
        { name: "YouTube", icon: Youtube, href: "#", color: "#ff0000" },
        { name: "LinkedIn", icon: Linkedin, href: "#", color: "#0077b5" }
      ]
    },
    locations: [
      "Mohali", "Chandigarh", "Panchkula", "Zirakpur",
      "Kharar", "Kurali", "Ropar", "Ambala",
      "Ludhiana", "Amritsar", "Jalandhar", "Pathankot",
      "Patiala", "Bathinda", "Sangrur", "Barnala",
      "Ferozepur", "Moga"
    ]
  };

  // Early return for server-side rendering to prevent hydration issues
  if (!isClient) {
    return (
      <footer className={styles.footerContainer}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.mainFooter}>
          <div className={styles.container}>
            <div className={styles.footerGrid} style={{ gridTemplateColumns: '1fr' }}>
              {/* Simplified server render */}
              <div className={styles.brandSection}>
                <div className={styles.logo}>🚖 OnlineTaxi</div>
                <div className={styles.tagline}>Loading...</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomFooter}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              © 2024 OnlineTaxi. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.backgroundPattern}></div>
      
      <div className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            {/* Service Areas - Moved to top */}
            <div className={styles.serviceAreasSection}>
              <h3 className={styles.sectionTitle}>
                Service Areas
                <div className={styles.sectionTitleUnderline}></div>
              </h3>
              <div className={styles.locationsGrid}>
                {footerData.locations.map((location, index) => (
                  <div
                    key={index}
                    className={styles.locationTag}
                  >
                    {location}
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Section */}
            <div className={styles.brandSection}>
            <div className={styles.logo}>
                <Image
                  src="/images/onlinetaxi-logo.png"
                  alt="OnlineTaxi Logo"
                  width={180}
                  height={60}
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.tagline}>
                {footerData.company.tagline}
              </div>
              <div className={styles.description}>
                {footerData.company.description}
              </div>

              {/* Stats */}
              <div className={styles.statsGrid}>
                {footerData.company.stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className={styles.statCard}
                    >
                      <IconComponent className={styles.statIcon} />
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={styles.sectionTitle}>
                Quick Links
                <div className={styles.sectionTitleUnderline}></div>
              </h3>
              <ul className={styles.linksList}>
                {footerData.quickLinks.map((link, index) => (
                  <li key={index} className={styles.linkItem}>
                    {link.name === "Terms & Conditions" ? (
                      <Link href={link.href} className={styles.link}>
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>▶</span>
                        {link.name}
                      </Link>
                    ) : link.name === "Book Now" ? (
                      <button 
                        onClick={handleBookNowClick} 
                        className={styles.link}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>▶</span>
                        {link.name}
                      </button>
                    ) : link.name === "Our Services" ? (
                      <button 
                        onClick={handleOurServicesClick} 
                        className={styles.link}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>▶</span>
                        {link.name}
                      </button>
                    ) : (
                      <a 
                        href={link.href} 
                        className={styles.link}
                      >
                        <span style={{ color: '#10b981', fontSize: '0.75rem' }}>▶</span>
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className={styles.sectionTitle}>
                Our Services
                <div className={styles.sectionTitleUnderline}></div>
              </h3>
              <div>
                {footerData.services.map((service, index) => (
                  <div 
                    key={index} 
                    className={styles.serviceItem}
                  >
                    <div className={styles.serviceName}>{service.name}</div>
                    <div className={styles.serviceDesc}>{service.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={styles.sectionTitle}>
                Contact Us
                <div className={styles.sectionTitleUnderline}></div>
              </h3>
              
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>{footerData.contact.phone}</strong>
                  <br />
                  <small>Call us anytime</small>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <div className={styles.contactText}>
                  {footerData.contact.email}
                  <br />
                  <small>Email support</small>
                </div>
              </div>

              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <div className={styles.contactText}>
                  {footerData.contact.address}
                  <br />
                  <small>Visit our office</small>
                </div>
              </div>

              <div className={styles.contactItem}>
                <Clock className={styles.contactIcon} />
                <div className={styles.contactText}>
                  <strong>{footerData.contact.hours}</strong>
                  <br />
                  <small>Always ready to serve</small>
                </div>
              </div>

              {/* Social Media */}
              <div className={styles.socialMedia}>
                {footerData.contact.socialMedia.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={styles.socialLink}
                      title={social.name}
                    >
                      <IconComponent className={styles.socialIcon} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>
        </div>
      </div>


    </footer>
  );
};

export default EnhancedFooter;