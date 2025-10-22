"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Clock, Route, Car, Phone, MessageCircle } from "lucide-react";
import styles from "./TopRoutes.module.css";

const TopRoutes = ({ showViewAll = true, maxRoutes, initialRoutes = [] }) => {
  const [favorites, setFavorites] = useState(new Set());
  const [routesData, setRoutesData] = useState(initialRoutes);
  const [loading, setLoading] = useState(initialRoutes.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if no initial data provided
    if (initialRoutes.length === 0) {
      const fetchTopRoutes = async () => {
        try {
          const res = await fetch('/api/toproutes');
          if (!res.ok) throw new Error('Failed to fetch routes');
          const data = await res.json();
          console.log('Top routes fetched:', data);
          setRoutesData(data.toproutes || []);
        } catch (err) {
          console.error('Error fetching top routes:', err);
          setError('Failed to load routes. Please try again later.');
        } finally {
          setLoading(false);
        }
      };

      fetchTopRoutes();
    } else {
      setLoading(false);
    }
  }, [initialRoutes]);

  const toggleFavorite = (routeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(routeId)) {
      newFavorites.delete(routeId);
    } else {
      newFavorites.add(routeId);
    }
    setFavorites(newFavorites);
  };

  const handleBookNow = (route) => {
    // Google Analytics tracking (optional)
    if (typeof gtag !== "undefined") {
      gtag("event", "book_now_click", {
        route_name: route.title,
        route_price: route.currentPrice,
        event_category: "engagement"
      });
    }

    const message = encodeURIComponent(
      `Hi! I want to book a taxi for ${route.title}. Price: ₹${route.currentPrice}. Please confirm availability.`
    );
    window.open(`https://wa.me/+919988222283?text=${message}`, "_blank");
  };

  const handleCallNow = () => {
    window.location.href = "tel:+919988222283";
  };

  // Loading state
  if (loading) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading routes...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (routesData.length === 0) {
    return (
      <section className={styles.routesSection}>
        <div className={styles.container}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Top Routes</h2>
          </header>
          <div className={styles.emptyState}>
            <p>No routes available at the moment.</p>
            <p>Please check back later!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.routesSection} itemScope itemType="https://schema.org/Service">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} itemProp="name">
            Our Top Routes
          </h2>
          <p className={styles.sectionSubtitle} itemProp="description">
            Discover our most popular destinations with unbeatable prices and premium service. 
            Professional drivers, clean vehicles, and 24/7 customer support.
          </p>
        </header>

        <div className={styles.routesGrid} role="main">
          {routesData.slice(0, maxRoutes || routesData.length).map((route) => (
            <Link key={route._id} href={`/routes/${route.slug || route._id}`} className={styles.routeCardLink}>
              <article
                className={styles.routeCard}
                itemScope
                itemType="https://schema.org/TravelAction"
              >
              <div className={styles.cardImageContainer}>
                <div className={styles.routeImageWrapper}>
                  <Image
                    src={route.image || "/api/placeholder/400/250"}
                    alt={route.imageAlt || route.title}
                    width={400}
                    height={250}
                    className={styles.routeImage}
                    priority={routesData.indexOf(route) <= 2}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    itemProp="image"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/250";
                    }}
                  />
                </div>

                <div className={styles.brandBadge} itemProp="provider" itemScope itemType="https://schema.org/Organization">
                  <Image
                    src="/images/onlinetaxi-logo.png"
                    alt="OnlineTaxi Logo"
                    width={80}
                    height={20}
                    className={styles.brandLogo}
                    itemProp="logo"
                  />
                </div>

                <button
                  className={`${styles.favoriteBtn} ${favorites.has(route._id) ? styles.active : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(route._id); }}
                  aria-label={`${favorites.has(route._id) ? 'Remove from' : 'Add to'} favorites`}
                >
                  <Heart
                    size={18}
                    fill={favorites.has(route._id) ? '#e74c3c' : 'none'}
                    stroke={favorites.has(route._id) ? '#e74c3c' : '#666'}
                  />
                </button>

                {route.discount && route.discount > 0 && (
                  <div className={styles.discountBadge} itemProp="discount">
                    {route.discount}% OFF
                  </div>
                )}
              </div>

              <div className={styles.cardContent}>
                <header className={styles.cardHeader}>
                  <h3 className={styles.routeTitle} itemProp="name">
                    {route.title}
                  </h3>
                  <p className={styles.routeDescription} itemProp="description">
                    {route.description}
                  </p>
                </header>

                <div className={styles.routeInfo} itemProp="additionalProperty" itemScope itemType="https://schema.org/PropertyValue">
                  <div className={styles.infoItem}>
                    <Route size={14} className={styles.infoIcon} />
                    <span className={styles.infoLabel}>Distance</span>
                    <span className={styles.infoValue} itemProp="value">{route.distance}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Clock size={14} className={styles.infoIcon} />
                    <span className={styles.infoLabel}>Duration</span>
                    <span className={styles.infoValue}>{route.duration}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <Car size={14} className={styles.infoIcon} />
                    <span className={styles.infoLabel}>Vehicle</span>
                    <span className={styles.infoValue}>{route.carType}</span>
                  </div>
                </div>

                {route.features && route.features.length > 0 && (
                  <div className={styles.routeFeaturesList}>
                    <h4 className={styles.featuresTitle}>Included Features</h4>
                    <div className={styles.features}>
                      {route.features.slice(0, 6).map((feature, idx) => (
                        <div key={idx} className={styles.routeFeatureItem}>
                          <span className={styles.featureCheck}>✓</span>
                          <span className={styles.routeFeatureText}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <footer className={styles.cardFooter}>
                  <div className={styles.pricing} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <div className={styles.priceSection}>
                      <div className={styles.fareLabel}>Starting From</div>
                      <div className={styles.priceContainer}>
                        <span className={styles.currentPrice} itemProp="price">
                          ₹{route.currentPrice ? route.currentPrice.toLocaleString() : '0'}
                        </span>
                        {route.originalPrice && route.originalPrice > route.currentPrice && (
                          <span className={styles.originalPrice}>
                            ₹{route.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <meta itemProp="priceCurrency" content="INR" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionButtons}>
                    <button className={`${styles.bookBtn} ${styles.primary}`} onClick={() => handleBookNow(route)}>
                      <MessageCircle size={16} /> Book Now
                    </button>
                    <button className={`${styles.bookBtn} ${styles.secondary}`} onClick={handleCallNow}>
                      <Phone size={16} /> Call
                    </button>
                  </div>
                </footer>
              </div>
            </article>
            </Link>
          ))}
        </div>

        {showViewAll && (
          <div className={styles.btnContainer}>
            <Link href="/routes" className={styles.viewAllBtn}>
              View All Routes →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default TopRoutes;