import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        
        {/* Animated red accent */}
        <motion.div
          className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-tedx-red/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase font-body">
              Independently Organized TED Event
            </span>
          </motion.div>

          <motion.h1
            className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl tracking-wide"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-foreground">KPRCAS</span>
            <br />
            <span className="text-tedx-red animate-pulse-glow">TED</span>
            <span className="text-foreground">X</span>
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

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" variant="tedx" className="group">
              Register Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-muted-foreground/30 hover:border-tedx-red hover:text-tedx-red">
              Watch Talks
            </Button>
          </motion.div>

          {/* Event details */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tedx-red" />
              <span className="font-body">Coming Soon 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-tedx-red" />
              <span className="font-body">KPRCAS Campus</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tedx-red" />
              <span className="font-body">500+ Attendees</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-tedx-red rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-6xl mb-6">
              What is <span className="text-tedx-red">TED</span>X?
            </h2>
            <p className="text-muted-foreground text-lg font-body leading-relaxed">
              TEDx is a grassroots initiative, created in the spirit of TED's overall mission to research and discover "ideas worth spreading." 
              TEDx brings the spirit of TED to local communities around the globe through TEDx events. 
              These events are organized by passionate individuals who seek to uncover new ideas and to share the latest research in their local areas.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Speakers' },
              { number: '500+', label: 'Attendees' },
              { number: '8+', label: 'Hours' },
              { number: '1', label: 'Unforgettable Day' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="font-display text-4xl md:text-5xl text-tedx-red">{stat.number}</div>
                <div className="mt-2 text-muted-foreground font-body">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <div className="font-display text-2xl">
            <span className="text-foreground">KPRCAS</span>
            <span className="text-tedx-red ml-2">TED</span>
            <span className="text-foreground">X</span>
          </div>
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
