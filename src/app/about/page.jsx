import AboutTaxiSection from '../components/AboutTaxiSection'
import AboutUs from '../components/AboutUs';
import EnhancedBanner from '../components/EnhancedBanner';
import TourGuides from '../components/TourGuides';
import  CallToAction from '../components/CallToAction';
import  EnhancedFooter from '../components/footer';

export default function AboutPage() {
  return (
    <div>
        <AboutUs />
      <AboutTaxiSection />
        <EnhancedBanner />
        <TourGuides />
        < CallToAction />
        <EnhancedFooter />
    </div>
  )
}
