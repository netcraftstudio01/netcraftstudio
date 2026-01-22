import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PreviewSection from "@/components/sections/PreviewSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      <Navigation />
      
      <main>
        <HeroSection />
        <PreviewSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
