import HeroSection from './components/HeroSection'
import BookingSection from './components/BookingSection'
import ToursSection from './components/ToursSection'
import TopRoutes from './components/TopRoutes';
import TaxiServicesPage from './components/TaxiServicesPage';
import AboutTaxiSection from './components/AboutTaxiSection';
import TestimonialsSection from './components/TestimonialsSection';
import EnhancedFooter from './components/footer';
import ScrollHandler from './components/ScrollHandler';
import { Suspense } from 'react';

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Server component to fetch initial data
async function HomeContent() {
  try {
    // Fetch initial data on the server
    const [toursRes, topRoutesRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tours`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/toproutes`, {
        next: { revalidate: 300 } // Cache for 5 minutes
      })
    ]);

    const toursData = toursRes.ok ? await toursRes.json() : { tours: [] };
    const topRoutesData = topRoutesRes.ok ? await topRoutesRes.json() : { toproutes: [] };

    return (
      <>
        <HeroSection />
        <BookingSection />
        <Suspense fallback={<LoadingSpinner />}>
          <ToursSection initialTours={toursData.tours || []} />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <TopRoutes maxRoutes={6} initialRoutes={topRoutesData.toproutes || []} />
        </Suspense>
        <TaxiServicesPage />
        <AboutTaxiSection />
        <TestimonialsSection />
        <EnhancedFooter />
        <ScrollHandler />
      </>
    );
  } catch (error) {
    console.error('Error fetching initial data:', error);
    // Fallback to client-side fetching if server fetch fails
    return (
      <>
        <HeroSection />
        <BookingSection />
        <Suspense fallback={<LoadingSpinner />}>
          <ToursSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <TopRoutes maxRoutes={6} />
        </Suspense>
        <TaxiServicesPage />
        <AboutTaxiSection />
        <TestimonialsSection />
        <EnhancedFooter />
        <ScrollHandler />
      </>
    );
  }
}

export default function Home() {
  return <HomeContent />;
}
