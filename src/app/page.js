"use client"; // 👈 add this at top (client component)

import { useEffect, useState } from "react";
import HeroSection from './components/HeroSection';
import BookingSection from './components/BookingSection';
import ToursSection from './components/ToursSection';
import TopRoutes from './components/TopRoutes';
import TaxiServicesPage from './components/TaxiServicesPage';
import AboutTaxiSection from './components/AboutTaxiSection';
import TestimonialsSection from './components/TestimonialsSection';
import EnhancedFooter from './components/footer';
import ScrollHandler from './components/ScrollHandler';

// Loading component
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

export default function Home() {
  const [tours, setTours] = useState([]);
  const [topRoutes, setTopRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, topRoutesRes] = await Promise.all([
          fetch("/api/tours"),
          fetch("/api/toproutes"),
        ]);

        const toursData = toursRes.ok ? await toursRes.json() : { tours: [] };
        const topRoutesData = topRoutesRes.ok ? await topRoutesRes.json() : { toproutes: [] };

        setTours(toursData.tours || []);
        setTopRoutes(topRoutesData.toproutes || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HeroSection />
      <BookingSection />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ToursSection initialTours={tours} />
          <TopRoutes maxRoutes={6} initialRoutes={topRoutes} />
        </>
      )}
      <TaxiServicesPage />
      <AboutTaxiSection />
      <TestimonialsSection />
      <EnhancedFooter />
      <ScrollHandler />
    </>
  );
}
