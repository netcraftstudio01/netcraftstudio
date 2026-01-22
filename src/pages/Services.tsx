import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import servicesBg from "@/assets/services-bg.jpg";
import {
  Globe,
  Smartphone,
  Brain,
  Cloud,
  Shield,
  Palette,
  Code,
  Database,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom websites and web applications built with cutting-edge technologies. From e-commerce platforms to enterprise solutions.",
    features: ["React & Next.js", "Node.js Backend", "API Development", "SEO Optimization"],
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.",
    features: ["React Native", "iOS Development", "Android Apps", "App Store Deployment"],
  },
  {
    icon: Brain,
    title: "AI Solutions",
    description:
      "Harness the power of artificial intelligence with custom ML models, chatbots, and intelligent automation systems.",
    features: ["Machine Learning", "NLP Solutions", "Computer Vision", "AI Integration"],
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description:
      "Scalable cloud infrastructure and DevOps solutions that grow with your business and ensure 99.9% uptime.",
    features: ["AWS & Azure", "Docker & Kubernetes", "CI/CD Pipelines", "Serverless Architecture"],
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Protect your digital assets with comprehensive security audits, penetration testing, and secure architecture design.",
    features: ["Security Audits", "Penetration Testing", "Compliance", "Incident Response"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive designs that convert visitors into customers. User research, wireframes, and prototypes included.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
  },
  {
    icon: Code,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business requirements and operational workflows.",
    features: ["Enterprise Software", "SaaS Development", "Legacy Modernization", "Integration"],
  },
  {
    icon: Database,
    title: "Data Engineering",
    description:
      "Transform raw data into actionable insights with modern data pipelines, warehouses, and analytics platforms.",
    features: ["Data Pipelines", "Analytics", "Visualization", "Real-time Processing"],
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: (typeof services)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -100 : 100, 0, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale }}
      className="gta-card p-8 group"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <service.icon className="w-10 h-10 text-primary group-hover:text-secondary transition-colors" />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="font-display text-2xl md:text-3xl text-foreground group-hover:gta-title transition-all duration-300">
            {service.title}
          </h3>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {service.features.map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-sm font-body bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <img
            src={servicesBg}
            alt="Services background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/90 via-background/70 to-background" />

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
              Our Services
            </motion.h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-body max-w-3xl mx-auto">
              Comprehensive IT solutions designed to elevate your business to
              new heights in the digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            {/* Services */}
            <div className="space-y-12">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`relative pl-12 lg:pl-0 ${
                    index % 2 === 0 ? "lg:pr-[52%]" : "lg:pl-[52%]"
                  }`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute left-0 lg:left-1/2 w-8 h-8 -translate-x-1/2 lg:-translate-x-1/2 bg-background border-4 border-primary rounded-full flex items-center justify-center z-10"
                    style={{
                      boxShadow: "0 0 20px hsl(276 100% 50% / 0.5)",
                    }}
                  >
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </motion.div>

                  <ServiceCard service={service} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
