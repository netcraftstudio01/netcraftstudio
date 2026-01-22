import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Briefcase,
  Monitor,
} from "lucide-react";

interface Service {
  icon: typeof Globe;
  title: string;
  description: string;
  features: string[];
  slug: string;
  click: string;
}

const services: Service[] = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Custom websites and web applications built with cutting-edge technologies. From e-commerce platforms to enterprise solutions, we create responsive, scalable web experiences.",
    features: ["React & Next.js", "Node.js Backend", "Responsive Design", "Performance Optimized"],
    slug: "web-development",
    click: "Click for more details",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android with intuitive interfaces and powerful functionality.",
    features: ["React Native", "iOS/Android", "Cross-Platform", "App Store Ready"],
    slug: "app-development",
    click: "Click for more details",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive designs that convert visitors into customers. User research, wireframes, prototypes, and complete design systems tailored to your brand.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    slug: "ui-ux-design",
    click: "Click for more details",
  },
  {
    icon: Code,
    title: "Website Restructuring",
    description:
      "Modernize and optimize your existing website with improved architecture, performance, and user experience. We rebuild legacy sites into powerful digital assets.",
    features: ["Performance Audit", "Architecture Redesign", "Migration Support", "SEO Optimization"],
    slug: "website-restructuring",
    click: "Click for more details",
  },
  {
    icon: Briefcase,
    title: "Product Development",
    description:
      "From concept to launch, we develop innovative digital products tailored to market needs. Full-stack solutions with scalability, security, and user-centric design.",
    features: ["Product Strategy", "MVP Development", "Scaling & Growth", "Market Ready"],
    slug: "product-development",
    click: "Click for more details",
  },
  {
    icon: Brain,
    title: "Automation Solutions",
    description:
      "Streamline your business processes with intelligent automation. Reduce manual work, increase efficiency, and focus on what matters with smart automation systems.",
    features: ["Workflow Automation", "Process Optimization", "AI Integration", "Custom Tools"],
    slug: "automation-solutions",
    click: "Click for more details",
  },
  {
    icon: Cloud,
    title: "Internet of Things",
    description:
      "Connect your devices and systems with IoT solutions that enable real-time monitoring, data collection, and intelligent decision-making across your operations.",
    features: ["IoT Architecture", "Device Integration", "Data Streaming", "Real-time Analytics"],
    slug: "internet-of-things",
    click: "Click for more details",
  },
  {
    icon: Database,
    title: "Data Digitalization",
    description:
      "Transform your data into actionable insights with modern digitalization. From legacy data migration to analytics platforms, we unlock the power of your data.",
    features: ["Data Migration", "Analytics Platforms", "Data Visualization", "Insights Engine"],
    slug: "data-digitalization",
    click: "Click for more details",
  },
  {
    icon: Monitor,
    title: "Desktop Application",
    description:
      "Powerful desktop applications for Windows, macOS, and Linux. Built with modern frameworks for performance, reliability, and seamless user experiences on all platforms.",
    features: ["Cross-Platform", "Electron/Tauri", "Native Performance", "Offline Capability"],
    slug: "desktop-application",
    click: "Click for more details",
  },
];

const ServiceCard = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  const navigate = useNavigate();
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
      className="gta-card p-4 sm:p-6 md:p-8 group cursor-pointer hover:shadow-[0_0_30px_hsl(276_100%_50%_/_0.3)] transition-all duration-300"
      onClick={() => navigate(`/service/${service.slug}`)}
    >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 items-start">
        <div className="flex-shrink-0">
          <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <service.icon className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-primary group-hover:text-secondary transition-colors" />
          </div>
        </div>

        <div className="flex-1 space-y-3 sm:space-y-4">
          <h3 className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground group-hover:gta-title transition-all duration-300">
            {service.title}
          </h3>
          <p className="text-muted-foreground font-body text-sm sm:text-base md:text-lg leading-relaxed">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {service.features.map((feature) => (
              <span
                key={feature}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-body bg-primary/10 text-primary rounded-full border border-primary/20"
              >
                {feature}
              </span>
            ))}
          </div>
          <motion.div
            className="pt-2 sm:pt-4"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.button
              animate={{ color: ["hsl(276 100% 50%)", "hsl(180 100% 50%)", "hsl(276 100% 50%)"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-display font-semibold text-sm sm:text-base hover:text-secondary transition-colors flex items-center gap-2 group/btn"
            >
              {service.click}
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </motion.button>
          </motion.div>
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
      <section className="hero-section min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] py-8 sm:py-12 md:py-16 pt-24 sm:pt-32 md:pt-40 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={servicesBg}
            alt="Services background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/90 via-background/70 to-background" />

        <div className="hero-content container mx-auto px-3 sm:px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black gta-title"
            >
              Our Services
            </motion.h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-foreground/80 font-body max-w-4xl mx-auto leading-relaxed">
              At NetCraft Studio, we deliver high-performance digital services built for speed, scalability, and impact. Our services are engineered to help businesses grow, adapt, and dominate in the digital space. Every solution is crafted with precision, powered by modern technology, and designed to perform flawlessly.<br /><br />
              We don't follow trends—we build systems that last.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            {/* Services */}
            <div className="space-y-8 md:space-y-12">
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
