'use client'

import HeroSection from './components/HeroSection'
import BookingSection from './components/BookingSection'
import ToursSection from './components/ToursSection'
import TopRoutes from './components/TopRoutes';
import TaxiServicesPage from './components/TaxiServicesPage';
import AboutTaxiSection from './components/AboutTaxiSection';
import TestimonialsSection from './components/TestimonialsSection';
import EnhancedFooter from './components/footer';
import ScrollHandler from './components/ScrollHandler';

export default function Home() {
  return (
    <>
      <HeroSection />
      <BookingSection />
      <ToursSection />
      <TopRoutes maxRoutes={6} />
      <TaxiServicesPage />
      <AboutTaxiSection />
      <TestimonialsSection />
      <EnhancedFooter />
      <ScrollHandler />
      {/* Other sections can go here */}
    </>
  )
}
