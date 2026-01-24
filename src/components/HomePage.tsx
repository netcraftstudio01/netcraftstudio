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
      viewport={{ once: true }}
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
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax transforms
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  // Magnetic hover for CTA
  const magnetic = useMagneticHover();

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
    { name: 'Dr. Sarah Chen', title: 'AI Researcher', image: '' },
    { name: 'Marcus Williams', title: 'Climate Activist', image: '' },
    { name: 'Priya Sharma', title: 'Entrepreneur', image: '' },
    { name: 'Alex Rivera', title: 'Neuroscientist', image: '' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Floating butterflies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <Butterfly key={i} delay={i * 1.5} />
        ))}
      </div>

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background elements */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
          
          {/* Animated morphing shapes */}
          <motion.div
            className="absolute top-1/4 -right-40 w-[500px] h-[500px] bg-tedx-red/10 blur-3xl animate-morph"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-40 w-[400px] h-[400px] bg-tedx-red/5 blur-3xl animate-morph"
            style={{ animationDelay: '2s' }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </motion.div>

        {/* Main hero content */}
        <motion.div 
          className="relative z-10 container mx-auto px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          {/* Sparkle decoration */}
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-tedx-red/50" />
          </motion.div>

          {/* Main heading with stagger animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase font-body animate-flicker">
              Independently Organized TED Event
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl tracking-wide"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="inline-block text-foreground"
              whileHover={{ scale: 1.05, color: 'hsl(352, 100%, 46%)' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              KPRCAS
            </motion.span>
            <br />
            <span className="text-tedx-red animate-pulse-glow">TED</span>
            <motion.span 
              className="text-foreground inline-block"
              whileHover={{ rotate: 180, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              X
            </motion.span>
          </motion.h1>

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

      {/* About Section with slide-in animation */}
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-tedx-red/5 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center fade-in-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-6xl mb-6">
              What is <span className="text-tedx-red animate-shimmer">TED</span>X?
            </h2>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              TEDx is a grassroots initiative, created in the spirit of TED's overall mission to research and discover "ideas worth spreading." 
              TEDx brings the spirit of TED to local communities around the globe through TEDx events. 
              These events are organized by passionate individuals who seek to uncover new ideas and to share the latest research in their local areas.
            </p>
          </motion.div>

          {/* Stats with counter animation */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
            {[
              { number: '10+', label: 'Speakers' },
              { number: '500+', label: 'Attendees' },
              { number: '8+', label: 'Hours' },
              { number: '1', label: 'Unforgettable Day' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="font-display text-4xl md:text-5xl text-tedx-red"
                  whileHover={{ 
                    textShadow: '0 0 30px hsl(352 100% 46% / 0.5)',
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="mt-2 text-muted-foreground font-body group-hover:text-foreground transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl md:text-6xl">
              Our <span className="text-tedx-red">Speakers</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Thought leaders and innovators sharing ideas worth spreading
            </p>
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
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-tedx-red/20 via-background to-tedx-red/20 animate-gradient"
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center glass rounded-2xl p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl mb-4">
              Ready to be <span className="text-tedx-red">Inspired</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Don't miss this opportunity to be part of something extraordinary.
            </p>
            <RippleButton size="lg" variant="tedx" className="group">
              Reserve Your Spot
              <ArrowRight className="ml-2 h-4 w-4 transition-all group-hover:translate-x-2 group-hover:scale-110" />
            </RippleButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border relative">
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
            className="font-display text-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-foreground">KPRCAS</span>
            <span className="text-tedx-red ml-2">TED</span>
            <span className="text-foreground">X</span>
          </motion.div>
          <p className="mt-4 text-muted-foreground text-sm font-body">
            This independent TEDx event is operated under license from TED.
          </p>
          <p className="mt-2 text-muted-foreground/60 text-xs font-body">
            © 2025 TEDxKPRCAS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
