import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import aboutBg from "@/assets/about-bg.jpg";
import { Users, Target, Rocket, Award } from "lucide-react";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Miller",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Developer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Design Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

const clients = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateLabs", logo: "IL" },
  { name: "DigitalWave", logo: "DW" },
  { name: "FutureTech", logo: "FT" },
  { name: "CyberNex", logo: "CN" },
  { name: "QuantumCore", logo: "QC" },
];

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section min-h-[80vh]">
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <img
            src={aboutBg}
            alt="About NetCraft Studio"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="hero-content container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-display font-black gta-title"
            >
              About Us
            </motion.h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-body max-w-3xl mx-auto">
              We are the architects of digital transformation, crafting
              experiences that define the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                <span className="gta-title">Our</span>{" "}
                <span className="text-secondary">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-body text-lg leading-relaxed">
                <p>
                  Founded in the heart of the digital revolution, NetCraft Studio
                  emerged from a vision to bridge creativity with technology.
                </p>
                <p>
                  What started as a small team of passionate developers has grown
                  into a powerhouse of innovation, serving clients across the globe.
                </p>
                <p>
                  We don't just build products—we craft digital experiences that
                  leave lasting impressions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Users, label: "50+", text: "Team Members", color: "primary" },
                { icon: Target, label: "200+", text: "Projects Done", color: "secondary" },
                { icon: Rocket, label: "10+", text: "Years Experience", color: "accent" },
                { icon: Award, label: "25+", text: "Awards Won", color: "primary" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="gta-card p-6 text-center"
                >
                  <stat.icon className={`w-10 h-10 mx-auto mb-4 text-${stat.color}`} />
                  <h3 className="text-3xl font-display font-bold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-muted-foreground font-body">{stat.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gta-title">Meet The</span>{" "}
              <span className="text-secondary">Team</span>
            </h2>
            <p className="text-muted-foreground text-lg font-body">
              The masterminds behind the digital magic
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="gta-card group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-secondary font-body">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gta-title">Trusted</span>{" "}
              <span className="text-secondary">Clients</span>
            </h2>
            <p className="text-muted-foreground text-lg font-body">
              Partnering with industry leaders worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="gta-card aspect-square flex items-center justify-center group cursor-pointer"
              >
                <div className="text-center">
                  <span className="font-display text-3xl text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {client.logo}
                  </span>
                  <p className="text-xs text-muted-foreground/50 mt-2 font-body opacity-0 group-hover:opacity-100 transition-opacity">
                    {client.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
