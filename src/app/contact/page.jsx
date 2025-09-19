import EnhancedFooter from '../components/footer';
import ContactSection from '../components/ContactSection';
import EnhancedContactSection from '../components/EnhancedContactSection';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  return (
    <div>
        <ContactSection />
         <EnhancedContactSection />
        <ContactForm />
      <EnhancedFooter />
     
    </div>
  );
}
