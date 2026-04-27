import WhatsAppButton from "../components/WhatsAppButton";
import HeroSection from "../components/home/HeroSection";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import ContactSection from "../components/home/ContactSection";
import LocationSection from "../components/home/LocationSection";

function Home() {
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen pb-24">
      <WhatsAppButton />
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <LocationSection />
      <ContactSection />
    </div>
  );
}

export default Home;