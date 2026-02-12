import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section min-h-screen">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src={heroBg}
          alt="GTA Vice City inspired cityscape"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/70 via-background/50 to-background" />

      {/* Scanlines Effect */}
      <div className="absolute inset-0 z-20 scanlines pointer-events-none opacity-30" />

      {/* Content */}
      <div className="hero-content container mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6 md:space-y-8"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-secondary font-display text-xs sm:text-sm md:text-lg lg:text-xl tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase"
          >
            Welcome to the Digital Age
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black gta-title leading-tight"
          >
            NetCraft
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-primary to-accent">
              Studio
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 font-body max-w-2xl mx-auto px-4"
          >
            
            <span className="text-primary">Where Creativity,</span>{" "}
            <span className="text-secondary">Meets Technology.</span>
          </motion.p>
          <br />
          Service & Product Based IT Solutions.

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 md:pt-8"
          >
            <Link to="/services">
              <Button variant="hero" size="lg" className="group sm:size-xl">
                <span className="relative z-10">Explore Services</span>
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="neon" size="lg" className="sm:size-xl">
                View Portfolio
              </Button>
            </Link>
          </motion.div>

          {/* Scroll Indicator: moved below tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.5 },
              y: { repeat: Infinity, duration: 2 },
            }}
            className="flex justify-center pt-6"
          >
            <ChevronDown className="w-6 sm:w-8 h-6 sm:h-8 text-primary animate-pulse" />
          </motion.div>
        </motion.div>

        {/* ...existing code... */}
      </div>
    </section>
  );
};

export default HeroSection;
