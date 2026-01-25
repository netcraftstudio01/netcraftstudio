import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Play, ChevronDown, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Butterfly particle component
const Butterfly = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ 
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
        y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
        opacity: 0 
      }}
      animate={{
        x: [null, Math.random() * 300 - 150, Math.random() * 300 - 150],
        y: [null, -100],
        opacity: [0, 1, 1, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-tedx-red/30">
        <path
          fill="currentColor"
          d="M12 2c-1.5 0-3 2-3 5s1.5 5 3 5 3-2 3-5-1.5-5-3-5zm-6 5c-2 0-4 2-4 5s2 5 4 5c1.5 0 3-1 4-2.5-1.5-1-2.5-3-2.5-5s1-4 2.5-5c-1-1.5-2.5-2.5-4-2.5zm12 0c-1.5 0-3 1-4 2.5 1.5 1 2.5 3 2.5 5s-1 4-2.5 5c1 1.5 2.5 2.5 4 2.5 2 0 4-2 4-5s-2-5-4-5z"
        />
      </svg>
    </motion.div>
  );
};

// Ripple effect on click
const RippleButton = ({ children, className, ...props }: React.ComponentProps<typeof Button>) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
  };

  return (
    <Button className={`relative overflow-hidden ${className}`} onClick={handleClick} {...props}>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      ))}
      {children}
    </Button>
  );
};

// Magnetic hover effect hook
const useMagneticHover = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { ref, position, handleMouseMove, handleMouseLeave };
};

// Speaker card with hover effects
const SpeakerCard = ({ name, title, image, index }: { name: string; title: string; image: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-zoom rounded-lg overflow-hidden aspect-[3/4] bg-secondary">
        <motion.div
          className="w-full h-full bg-gradient-to-br from-tedx-red/20 to-transparent"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent rounded-lg flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-display text-xl text-foreground">{name}</h3>
        <p className="text-tedx-red text-sm">{title}</p>
      </motion.div>

      {/* Default label */}
      <motion.div
        className="mt-4 text-center"
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-display text-lg text-foreground">{name}</h3>
        <p className="text-muted-foreground text-sm">{title}</p>
      </motion.div>
    </motion.div>
  );
};

const HomePage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax transforms
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  // Magnetic hover for CTA
  const magnetic = useMagneticHover();

  // Countdown timer
  useEffect(() => {
    const calculateCountdown = () => {
      const eventDate = new Date('2025-03-23').getTime();
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / 1000 / 60) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fade in sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section, .stagger-children').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const speakers = [
    { name: 'Speaker', title: 'AI Researcher', image: '' },
    { name: 'Speaker', title: 'Climate Activist', image: '' },
    { name: 'Speaker', title: 'Entrepreneur', image: '' },
    { name: 'Speaker', title: 'Neuroscientist', image: '' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="font-display text-2xl font-bold"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-tedx-red">TED<span className="text-lg inline-block align-text-top relative" style={{top: '-4px'}}>x</span></span>
              <span className="text-foreground ml-2">KPRCAS</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-muted-foreground hover:text-tedx-red transition-colors font-body text-sm">
                Home
              </a>
              <a href="#about" className="text-muted-foreground hover:text-tedx-red transition-colors font-body text-sm">
                About
              </a>
              <a href="#speakers" className="text-muted-foreground hover:text-tedx-red transition-colors font-body text-sm">
                Speakers
              </a>
              <a href="#team" className="text-muted-foreground hover:text-tedx-red transition-colors font-body text-sm">
                Team
              </a>
              <a href="#contacts" className="text-muted-foreground hover:text-tedx-red transition-colors font-body text-sm">
                Contacts
              </a>
              <Button variant="tedx" size="sm" className="ml-4">
                Register
              </Button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-foreground"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              {isNavOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isNavOpen && (
              <motion.div
                className="md:hidden mt-4 pb-4 flex flex-col gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <a 
                  href="#home" 
                  className="text-muted-foreground hover:text-tedx-red transition-colors font-body"
                  onClick={() => setIsNavOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#about" 
                  className="text-muted-foreground hover:text-tedx-red transition-colors font-body"
                  onClick={() => setIsNavOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#speakers" 
                  className="text-muted-foreground hover:text-tedx-red transition-colors font-body"
                  onClick={() => setIsNavOpen(false)}
                >
                  Speakers
                </a>
                <a 
                  href="#team" 
                  className="text-muted-foreground hover:text-tedx-red transition-colors font-body"
                  onClick={() => setIsNavOpen(false)}
                >
                  Team
                </a>
                <a 
                  href="#contacts" 
                  className="text-muted-foreground hover:text-tedx-red transition-colors font-body"
                  onClick={() => setIsNavOpen(false)}
                >
                  Contacts
                </a>
                <Button variant="tedx" size="sm" className="w-full">
                  Register
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      {/* Floating butterflies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <Butterfly key={i} delay={i * 1.5} />
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
          
          {/* Animated geometric lines - Top left */}
          <motion.div
            className="absolute top-0 left-0 w-96 h-40 bg-black border-l-4 border-t-4 border-tedx-red rounded-full"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Animated geometric lines - Top right */}
          <motion.div
            className="absolute top-20 right-0 w-80 h-32 bg-black border-r-4 border-t-4 border-tedx-red rounded-full"
            animate={{
              x: [0, -40, 0],
              y: [0, 15, 0],
              rotate: [0, -8, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Animated geometric lines - Bottom left */}
          <motion.div
            className="absolute bottom-0 left-10 w-72 h-36 bg-black border-l-4 border-b-4 border-tedx-red rounded-full"
            animate={{
              x: [0, 25, 0],
              y: [0, 25, 0],
              rotate: [0, 6, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Animated geometric lines - Bottom right */}
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-40 bg-black border-r-4 border-b-4 border-tedx-red rounded-full"
            animate={{
              x: [0, -35, 0],
              y: [0, 20, 0],
              rotate: [0, -7, 0],
            }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          
          {/* Animated morphing shapes */}
          <motion.div
            className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-black border-4 border-tedx-red blur-lg rounded-full animate-morph"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-black border-4 border-tedx-red blur-lg rounded-full animate-morph"
            style={{ animationDelay: '2s' }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, -25, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          {/* Center floating element */}
          <motion.div
            className="absolute top-1/3 left-1/3 w-48 h-48 bg-black border-4 border-tedx-red rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 40, 0],
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Main hero content */}
        <motion.div 
          className="relative z-10 container mx-auto px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Main heading with stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-8 px-6 py-3 rounded-full border border-tedx-red/50 bg-tedx-red/5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className="text-tedx-red text-sm md:text-base font-body tracking-wide inline-flex items-start gap-1">
                <span className="text-xs md:text-sm -mb-1.5 inline-block relative" style={{ top: '2px' }}>X</span> = Independently organised TED event
              </span>
            </motion.div>

            {/* <span className="block text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase font-body animate-flicker">
              Independently Organized TED Event
            </span> */}
          </motion.div>

          <motion.h1
            className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl tracking-wide"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="block mb-4 leading-tight">
              <span className="text-tedx-red animate-pulse-glow">TED</span>
              <motion.span 
                className="text-foreground inline-block text-4xl md:text-5xl lg:text-6xl align-text-top relative" 
                style={{top: '-8px'}}
                whileHover={{ rotate: 180, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                X
              </motion.span>
            </div>
            <motion.span 
              className="block text-foreground text-5xl md:text-6xl lg:text-7xl"
              whileHover={{ scale: 1.05, color: 'hsl(352, 100%, 46%)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              KPRCAS
            </motion.span>
          </motion.h1>

          <motion.p
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-body tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            KPR College of Arts Science and Research
          </motion.p>

          <motion.p
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Join us for an extraordinary experience of ideas, innovation, and inspiration. 
            Where thoughts transform into movements.
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div
              ref={magnetic.ref}
              onMouseMove={magnetic.handleMouseMove}
              onMouseLeave={magnetic.handleMouseLeave}
              style={{
                transform: `translate(${magnetic.position.x}px, ${magnetic.position.y}px)`,
              }}
              className="transition-transform duration-200"
            >
              <RippleButton size="lg" variant="tedx" className="group">
                Register Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </RippleButton>
            </div>
            
            <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-muted-foreground/30 hover:border-tedx-red hover:text-tedx-red group butterfly-ripple"
                >
                  <Play className="mr-2 h-4 w-4 transition-transform group-hover:scale-125" />
                  Watch Teaser
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-background/95 backdrop-blur-xl border-border">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    TEDx<span className="text-tedx-red">KPRCAS</span> Teaser
                  </DialogTitle>
                </DialogHeader>
                <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Video coming soon...</p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Event details with tooltips */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-2 cursor-pointer state-transition hover:text-tedx-red"
                  whileHover={{ scale: 1.1 }}
                >
                  <Calendar className="h-5 w-5 text-tedx-red" />
                  <span className="font-body">Coming Soon 2025</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary border-border">
                <p>Date to be announced</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-2 cursor-pointer state-transition hover:text-tedx-red"
                  whileHover={{ scale: 1.1 }}
                >
                  <MapPin className="h-5 w-5 text-tedx-red" />
                  <span className="font-body">KPRCAS Campus</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary border-border">
                <p>Main Auditorium, KPRCAS</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  className="flex items-center gap-2 cursor-pointer state-transition hover:text-tedx-red"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="h-5 w-5 text-tedx-red" />
                  <span className="font-body">500+ Attendees</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary border-border">
                <p>Limited seats available</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          whileHover={{ scale: 1.2 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2 hover:border-tedx-red transition-colors">
            <motion.div
              className="w-1 h-2 bg-tedx-red rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <ChevronDown className="w-4 h-4 mx-auto mt-2 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* Event Showcase Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Featured cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Featured Speaker Card */}
            <motion.div
              className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-secondary to-background border border-border/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Featured Speaker</span>
                  </div>
                  <p className="text-muted-foreground text-sm">Coming Soon</p>
                </div>
              </div>
            </motion.div>

            {/* Butterfly/Theme Card */}
            <motion.div
              className="rounded-2xl overflow-hidden h-64 bg-white/5 border-2 border-border flex items-center justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg width="120" height="120" viewBox="0 0 24 24" className="text-muted-foreground/30">
                  <path
                    fill="currentColor"
                    d="M12 2c-1.5 0-3 2-3 5s1.5 5 3 5 3-2 3-5-1.5-5-3-5zm-6 5c-2 0-4 2-4 5s2 5 4 5c1.5 0 3-1 4-2.5-1.5-1-2.5-3-2.5-5s1-4 2.5-5c-1-1.5-2.5-2.5-4-2.5zm12 0c-1.5 0-3 1-4 2.5 1.5 1 2.5 3 2.5 5s-1 4-2.5 5c1 1.5 2.5 2.5 4 2.5 2 0 4-2 4-5s-2-5-4-5z"
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Book Tickets Card */}
            <motion.div
              className="rounded-2xl overflow-hidden h-64 bg-gradient-to-br from-tedx-red to-red-900 border border-tedx-red/50 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-white text-xl font-display mb-4">BOOK TICKETS</h3>
              <p className="text-white/90 font-display text-3xl font-bold">
                23<br /><span className="text-lg">MAR</span>
              </p>
              <p className="text-white/70 text-sm mt-2">2026</p>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <motion.div
            className="max-w-4xl mx-auto border-2 border-tedx-red rounded-3xl p-8 md:p-12 bg-background/50"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-4 gap-4 md:gap-8">
              {/* Days */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-5xl font-black text-foreground font-display tracking-tighter mb-3">
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm font-body uppercase tracking-widest">
                  Days
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-3xl md:text-5xl font-black text-foreground font-display tracking-tighter mb-3">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm font-body uppercase tracking-widest">
                  Hours
                </div>
              </motion.div>

              {/* Minutes */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-3xl md:text-5xl font-black text-foreground font-display tracking-tighter mb-3">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm font-body uppercase tracking-widest">
                  Minutes
                </div>
              </motion.div>

              {/* Seconds */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-3xl md:text-5xl font-black text-foreground font-display tracking-tighter mb-3">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm font-body uppercase tracking-widest">
                  Seconds
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div className="absolute top-20 right-0 w-80 h-32 bg-black border-r-4 border-t-4 border-tedx-red rounded-full" animate={{ x: [0, -40, 0], y: [0, 15, 0], rotate: [0, -8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <motion.div className="absolute bottom-40 left-10 w-72 h-36 bg-black border-l-4 border-b-4 border-tedx-red rounded-full" animate={{ x: [0, 25, 0], y: [0, 25, 0], rotate: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        </motion.div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2 
                className="font-display text-5xl md:text-6xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <span className="text-tedx-red">ABOUT</span>
                <span className="text-foreground">X</span>
              </motion.h2>

              <div className="space-y-6 text-muted-foreground font-body text-base md:text-lg leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="hover:text-foreground transition-colors"
                >
                  TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. At our TEDxKPRCAS event, TED Talks video and live speakers will combine to spark deep discussion and connection.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="hover:text-foreground transition-colors"
                >
                  The TED Conference provides general guidance for the TEDx program, but individual TEDx events, including ours, are self-organized. The spirit of TED - ideas worth spreading - is at the heart of everything we do.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="hover:text-foreground transition-colors"
                >
                  Join us for a day filled with inspiring talks, innovative ideas, and meaningful connections. Our carefully curated lineup of speakers will challenge your perspective and ignite your passion for change.
                </motion.p>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <motion.div
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.2, y: -10 }}
                >
                  <motion.div 
                    className="font-display text-4xl md:text-5xl text-tedx-red font-bold"
                    whileHover={{ textShadow: '0 0 20px hsl(352 100% 46% / 0.8)' }}
                  >
                    10+
                  </motion.div>
                  <div className="text-muted-foreground text-sm md:text-base mt-2 group-hover:text-tedx-red transition-colors">Speakers</div>
                </motion.div>

                <motion.div
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.2, y: -10 }}
                >
                  <motion.div 
                    className="font-display text-4xl md:text-5xl text-tedx-red font-bold"
                    whileHover={{ textShadow: '0 0 20px hsl(352 100% 46% / 0.8)' }}
                  >
                    100+
                  </motion.div>
                  <div className="text-muted-foreground text-sm md:text-base mt-2 group-hover:text-tedx-red transition-colors">Attendees</div>
                </motion.div>

                <motion.div
                  className="text-center group cursor-pointer"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.2, y: -10 }}
                >
                  <motion.div 
                    className="font-display text-4xl md:text-5xl text-tedx-red font-bold"
                    whileHover={{ textShadow: '0 0 20px hsl(352 100% 46% / 0.8)' }}
                  >
                    8hrs
                  </motion.div>
                  <div className="text-muted-foreground text-sm md:text-base mt-2 group-hover:text-tedx-red transition-colors">Of Content</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Visual Element */}
            <motion.div
              className="relative h-96 lg:h-full min-h-96"
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-tedx-red/20 to-tedx-red/5 rounded-3xl border-2 border-tedx-red/40"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(220, 38, 38, 0.3)',
                    '0 0 40px rgba(220, 38, 38, 0.5)',
                    '0 0 20px rgba(220, 38, 38, 0.3)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Circular element in corner */}
              <motion.div
                className="absolute top-8 right-8 w-32 h-32 border-2 border-tedx-red rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                whileHover={{ scale: 1.15 }}
              />

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="font-display text-2xl md:text-3xl text-tedx-red/80">
                    Ideas Worth
                    <br />
                    Spreading
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute bottom-8 left-8 w-20 h-20 border border-tedx-red/30 rounded-lg"
                animate={{ rotate: [0, -5, 0], y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                whileHover={{ borderColor: 'rgb(220, 38, 38)', scale: 1.2 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className="py-24 relative overflow-hidden">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div className="absolute top-0 left-0 w-96 h-40 bg-black border-l-4 border-t-4 border-tedx-red rounded-full" animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-0 right-20 w-96 h-40 bg-black border-r-4 border-b-4 border-tedx-red rounded-full" animate={{ x: [0, -35, 0], y: [0, 20, 0], rotate: [0, -7, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="font-display text-4xl md:text-6xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              Our <span className="text-tedx-red">Speakers</span>
            </motion.h2>
            <motion.p 
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Thought leaders and innovators sharing ideas worth spreading
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {speakers.map((speaker, index) => (
              <SpeakerCard key={speaker.name} {...speaker} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with gradient animation */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div className="absolute top-20 left-0 w-80 h-32 bg-black border-l-4 border-t-4 border-tedx-red rounded-full" animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-10 right-0 w-96 h-40 bg-black border-r-4 border-b-4 border-tedx-red rounded-full" animate={{ x: [0, -35, 0], y: [0, 20, 0], rotate: [0, -7, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
        </motion.div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center glass rounded-2xl p-12"
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, boxShadow: '0 30px 60px rgba(220, 38, 38, 0.2)' }}
          >
            <motion.h2 
              className="font-display text-4xl md:text-5xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Ready to be <span className="text-tedx-red">Inspired</span>?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Don't miss this opportunity to be part of something extraordinary.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <RippleButton size="lg" variant="tedx" className="group">
                Reserve Your Spot
                <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-2 group-hover:scale-110" />
              </RippleButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 relative overflow-hidden">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div className="absolute top-0 right-0 w-80 h-32 bg-black border-r-4 border-t-4 border-tedx-red rounded-full" animate={{ x: [0, -40, 0], y: [0, 15, 0], rotate: [0, -8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <motion.div className="absolute bottom-40 left-10 w-72 h-36 bg-black border-l-4 border-b-4 border-tedx-red rounded-full" animate={{ x: [0, 25, 0], y: [0, 25, 0], rotate: [0, 6, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="font-display text-4xl md:text-6xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              Our <span className="text-tedx-red">Team</span>
            </motion.h2>
            <motion.p 
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Dedicated individuals making TEDx KPRCAS possible
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p 
              className="text-muted-foreground text-lg font-body leading-relaxed hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Our passionate team works tirelessly to bring world-class ideas to our community. 
              We believe in the power of innovation and collaboration to create meaningful change.
            </motion.p>
            <motion.div 
              className="mt-8 bg-secondary/50 rounded-lg p-8 border border-border/50"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, borderColor: 'rgb(220, 38, 38)' }}
            >
              <p className="text-foreground font-semibold mb-4">Team Coming Soon</p>
              <p className="text-muted-foreground text-sm">Meet our amazing team members who are organizing this event.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-24 bg-secondary/30 relative overflow-hidden">
        {/* Animated geometric background */}
        <motion.div 
          className="absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          <motion.div className="absolute top-0 left-0 w-96 h-40 bg-black border-l-4 border-t-4 border-tedx-red rounded-full" animate={{ x: [0, 30, 0], y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-0 right-20 w-96 h-40 bg-black border-r-4 border-b-4 border-tedx-red rounded-full" animate={{ x: [0, -35, 0], y: [0, 20, 0], rotate: [0, -7, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2 
              className="font-display text-4xl md:text-6xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              Get in <span className="text-tedx-red">Touch</span>
            </motion.h2>
            <motion.p 
              className="mt-4 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have questions? We'd love to hear from you
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              className="text-center glass rounded-lg p-8 border border-border/50 group cursor-pointer"
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0 }}
              whileHover={{ scale: 1.15, y: -15, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)' }}
            >
              <motion.div 
                className="inline-block p-3 bg-tedx-red/10 rounded-lg mb-4 group-hover:bg-tedx-red/20 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-6 h-6 text-tedx-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="font-display text-lg mb-2 group-hover:text-tedx-red transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Email
              </motion.h3>
              <p className="text-muted-foreground text-sm">contact@tedxkprcas.com</p>
            </motion.div>

            <motion.div
              className="text-center glass rounded-lg p-8 border border-border/50 group cursor-pointer"
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.15, y: -15, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)' }}
            >
              <motion.div 
                className="inline-block p-3 bg-tedx-red/10 rounded-lg mb-4 group-hover:bg-tedx-red/20 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <svg className="w-6 h-6 text-tedx-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 7.313a1 1 0 00.502.922l2.040 1.57a6 6 0 00-5.519 3.505m0 0a6 6 0 003.255 5.888m0 0a1 1 0 00.886 1.666M7 20.971m0 0a1 1 0 100 2 1 1 0 000-2m6-2.036a1 1 0 10.217-1.997 1 1 0 00-.217 1.997m0 0a1 1 0 100 2 1 1 0 000-2" />
                </svg>
              </motion.div>
              <motion.h3 
                className="font-display text-lg mb-2 group-hover:text-tedx-red transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Phone
              </motion.h3>
              <p className="text-muted-foreground text-sm">+91 (XXX) XXX-XXXX</p>
            </motion.div>

            <motion.div
              className="text-center glass rounded-lg p-8 border border-border/50 group cursor-pointer"
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.15, y: -15, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)' }}
            >
              <motion.div 
                className="inline-block p-3 bg-tedx-red/10 rounded-lg mb-4 group-hover:bg-tedx-red/20 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin className="w-6 h-6 text-tedx-red" />
              </motion.div>
              <motion.h3 
                className="font-display text-lg mb-2 group-hover:text-tedx-red transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                Location
              </motion.h3>
              <p className="text-muted-foreground text-sm">KPRCAS Campus, India</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border relative">
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-tedx-red/20 rounded-full"
              initial={{ x: Math.random() * 100 + '%', y: '100%' }}
              animate={{ y: '-100%' }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 3,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div 
            className="font-display text-2xl inline-flex items-center gap-0"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-foreground">TED</span>
            <span className="text-tedx-red text-xl relative" style={{top: '-11px'}}>X</span>
            <span className="text-foreground ml-2">KPRCAS</span>
          </motion.div>
          <p className="mt-4 text-muted-foreground text-sm font-body">
            This independent TEDx event is operated under license from TED.
          </p>
          <p className="mt-2 text-muted-foreground/60 text-xs font-body">
            © 2026 TEDxKPRCAS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
