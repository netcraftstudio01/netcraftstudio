import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import {
  Globe,
  Smartphone,
  Palette,
  Code,
  Briefcase,
  Brain,
  Cloud,
  Database,
  Monitor,
} from "lucide-react";

interface ServiceInfo {
  icon: typeof Globe;
  title: string;
  shortDescription: string;
  fullDescription: string;
  whatItMeans: string;
  useCases: string[];
  benefits: string[];
  technologies: string[];
  features: string[];
}

const servicesData: Record<string, ServiceInfo> = {
  "web-development": {
    icon: Globe,
    title: "Web Development",
    shortDescription:
      "Custom websites and web applications built with cutting-edge technologies.",
    fullDescription:
      "At NetCraft Studio, we create powerful, responsive web applications that drive business growth. Our expertise spans modern frontend frameworks and robust backend systems, delivering solutions that are fast, secure, and scalable.",
    whatItMeans:
      "Web development is the process of building and maintaining websites and web applications. It involves designing user interfaces, developing backend logic, integrating databases, and ensuring seamless experiences across all devices.",
    useCases: [
      "E-commerce platforms with shopping cart and payments",
      "Content management systems for publishing",
      "Enterprise web applications for business operations",
      "SaaS platforms for software delivery",
      "Real-time collaboration tools",
      "Progressive web apps for offline functionality",
    ],
    benefits: [
      "Increased online presence and market reach",
      "24/7 availability for customers",
      "Improved customer engagement and conversion",
      "Scalable infrastructure for business growth",
      "Seamless system integration",
      "Enhanced security and data protection",
    ],
    technologies: [
      "React & Next.js",
      "Node.js Backend",
      "TypeScript",
      "Express.js",
      "PostgreSQL/MongoDB",
      "API Development",
    ],
    features: [
      "React & Next.js",
      "Node.js Backend",
      "Responsive Design",
      "Performance Optimized",
    ],
  },
  "app-development": {
    icon: Smartphone,
    title: "App Development",
    shortDescription:
      "Native and cross-platform mobile applications for iOS and Android.",
    fullDescription:
      "We develop high-performance mobile applications that deliver exceptional user experiences. Whether you need a native app for maximum performance or a cross-platform solution, our team brings your vision to life.",
    whatItMeans:
      "App development is the creation of software applications that run on mobile devices. This includes native apps built for iOS or Android, as well as cross-platform apps that work on multiple operating systems.",
    useCases: [
      "Social networking and messaging applications",
      "Mobile banking and financial services",
      "Healthcare and fitness tracking apps",
      "On-demand delivery and logistics apps",
      "Gaming and entertainment applications",
      "Productivity and task management tools",
    ],
    benefits: [
      "Direct access to customers on mobile devices",
      "Push notifications for real-time engagement",
      "Offline functionality and data sync",
      "Native performance and smooth UX",
      "Access to device features (camera, GPS, etc.)",
      "Higher user retention and loyalty",
    ],
    technologies: [
      "React Native",
      "iOS Development (Swift)",
      "Android Development (Kotlin)",
      "Firebase",
      "Mobile UI/UX Design",
      "Biometric Authentication",
    ],
    features: [
      "React Native",
      "iOS/Android",
      "Cross-Platform",
      "App Store Ready",
    ],
  },
  "ui-ux-design": {
    icon: Palette,
    title: "UI/UX Design",
    shortDescription:
      "Beautiful, intuitive designs that convert visitors into customers.",
    fullDescription:
      "Our UI/UX design services create visually stunning and user-friendly interfaces that drive engagement. We combine user research, design thinking, and modern principles to deliver experiences that delight users and achieve business goals.",
    whatItMeans:
      "UI/UX design focuses on creating intuitive and aesthetically pleasing interfaces. UI deals with visual design, while UX encompasses the entire interaction and satisfaction of users with the product.",
    useCases: [
      "Website redesigns for improved conversion",
      "Mobile app interface design",
      "Enterprise application UI/UX",
      "E-commerce platform optimization",
      "Design system creation for consistency",
      "Accessibility improvements for inclusive design",
    ],
    benefits: [
      "Increased user engagement and satisfaction",
      "Higher conversion rates and revenue",
      "Reduced bounce rates and improved retention",
      "Brand consistency and recognition",
      "Improved accessibility for all users",
      "Faster development through design systems",
    ],
    technologies: [
      "Figma & Adobe XD",
      "User Research",
      "Wireframing & Prototyping",
      "Design Systems",
      "Interaction Design",
      "Accessibility (WCAG)",
    ],
    features: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
    ],
  },
  "website-restructuring": {
    icon: Code,
    title: "Website Restructuring",
    shortDescription:
      "Modernize and optimize your existing website with improved architecture.",
    fullDescription:
      "Transform outdated websites into modern, high-performance digital assets. We audit, redesign, and rebuild existing sites to meet current standards and exceed user expectations while maintaining your brand identity.",
    whatItMeans:
      "Website restructuring involves modernizing and rebuilding existing websites with current technologies, improved architecture, better performance, and enhanced user experience.",
    useCases: [
      "Legacy website modernization",
      "Performance optimization for slow sites",
      "Security updates and vulnerability fixes",
      "Mobile-first redesigns",
      "Migration to new platforms",
      "SEO improvement and ranking recovery",
    ],
    benefits: [
      "Significantly improved performance (3x faster)",
      "Modern, maintainable codebase",
      "Better SEO and search rankings",
      "Enhanced security and compliance",
      "Perfect mobile experience",
      "Seamless migration with zero downtime",
    ],
    technologies: [
      "Modern Frontend Stack",
      "Cloud Infrastructure",
      "CDN Integration",
      "Security Tools",
      "Analytics Platforms",
      "Performance Optimization",
    ],
    features: [
      "Performance Audit",
      "Architecture Redesign",
      "Migration Support",
      "SEO Optimization",
    ],
  },
  "product-development": {
    icon: Briefcase,
    title: "Product Development",
    shortDescription:
      "Full digital product development from concept to market launch.",
    fullDescription:
      "Turn your vision into a market-ready digital product. We handle everything from MVP development to scaling, ensuring your product succeeds in competitive markets with proper strategy and execution.",
    whatItMeans:
      "Product development is the complete process of creating a digital product from ideation through market launch. It includes strategy, design, development, testing, and optimization.",
    useCases: [
      "SaaS platform development and launch",
      "Mobile-first product creation",
      "Minimum Viable Product (MVP) development",
      "Product scaling and optimization",
      "Feature development and iterations",
      "Market-ready product launches",
    ],
    benefits: [
      "Rapid MVP to market launch",
      "User-centric design approach",
      "Scalable technology foundation",
      "Data-driven decision making",
      "Product-market fit validation",
      "Continuous improvement capability",
    ],
    technologies: [
      "Full-Stack Development",
      "Cloud Platforms",
      "Databases & Data Management",
      "DevOps & CI/CD",
      "Analytics Tools",
      "Agile Methodology",
    ],
    features: [
      "Product Strategy",
      "MVP Development",
      "Scaling & Growth",
      "Market Ready",
    ],
  },
  "automation-solutions": {
    icon: Brain,
    title: "Automation Solutions",
    shortDescription:
      "Streamline business processes with intelligent automation systems.",
    fullDescription:
      "Reduce manual work and increase efficiency with intelligent automation. Our solutions automate repetitive tasks, streamline workflows, and allow your team to focus on high-value activities.",
    whatItMeans:
      "Automation solutions use technology to automate repetitive business processes. This includes workflow automation, RPA, and intelligent systems that reduce manual effort.",
    useCases: [
      "Business process automation (RPA)",
      "Workflow automation across departments",
      "Data entry and processing automation",
      "Report generation and distribution",
      "System integration and data sync",
      "Customer service automation",
    ],
    benefits: [
      "Eliminate manual, repetitive tasks",
      "Significant cost reduction",
      "Minimize human errors",
      "Complete tasks in minutes (not hours)",
      "Handle more volume with same team",
      "Integration with existing tools",
    ],
    technologies: [
      "RPA Tools & Platforms",
      "Python Scripting",
      "Node.js Automation",
      "Zapier Integration",
      "Custom Workflows",
      "AI-powered Automation",
    ],
    features: [
      "Workflow Automation",
      "Process Optimization",
      "AI Integration",
      "Custom Tools",
    ],
  },
  "internet-of-things": {
    icon: Cloud,
    title: "Internet of Things",
    shortDescription:
      "IoT connectivity and smart device solutions for modern businesses.",
    fullDescription:
      "Deploy IoT solutions that connect devices, collect real-time data, and enable intelligent decision-making. Our IoT expertise spans hardware integration, data collection, and analytics.",
    whatItMeans:
      "Internet of Things (IoT) involves connecting physical devices to the internet to collect and exchange data. This enables real-time monitoring, automation, and intelligent decision-making.",
    useCases: [
      "Smart building and facility management",
      "Industrial IoT and manufacturing",
      "Asset tracking and logistics",
      "Environmental monitoring systems",
      "Smart home automation",
      "Healthcare and medical devices",
    ],
    benefits: [
      "Real-time monitoring and visibility",
      "Actionable insights from live data",
      "Significant cost optimization",
      "Predictive maintenance capabilities",
      "Remote device management",
      "Scalable infrastructure for growth",
    ],
    technologies: [
      "IoT Platforms & Services",
      "Arduino & Raspberry Pi",
      "MQTT Protocol",
      "Cloud IoT Services",
      "Sensor Integration",
      "Real-time Data Processing",
    ],
    features: [
      "IoT Architecture",
      "Device Integration",
      "Data Streaming",
      "Real-time Analytics",
    ],
  },
  "data-digitalization": {
    icon: Database,
    title: "Data Digitalization",
    shortDescription:
      "Transform data into insights with modern analytics platforms.",
    fullDescription:
      "Unlock the power of your data with modern digitalization. We migrate legacy data, build analytics platforms, and create dashboards that drive informed business decisions.",
    whatItMeans:
      "Data digitalization involves converting physical data to digital formats and building systems to collect, process, and analyze data for business intelligence.",
    useCases: [
      "Legacy data migration to cloud",
      "Analytics dashboard creation",
      "Real-time business intelligence",
      "Data warehouse implementation",
      "Predictive analytics setup",
      "Custom reporting systems",
    ],
    benefits: [
      "Complete data visibility and understanding",
      "Real-time business metrics",
      "Data-driven strategic decisions",
      "Competitive intelligence advantage",
      "Improved operational efficiency",
      "Compliance and governance",
    ],
    technologies: [
      "Data Warehouses (Snowflake, BigQuery)",
      "BI Tools (Tableau, Power BI)",
      "Python Data Analysis",
      "SQL & Databases",
      "Cloud Analytics",
      "Data Visualization",
    ],
    features: [
      "Data Migration",
      "Analytics Platforms",
      "Data Visualization",
      "Insights Engine",
    ],
  },
  "desktop-application": {
    icon: Monitor,
    title: "Desktop Application",
    shortDescription:
      "Powerful desktop applications for Windows, macOS, and Linux.",
    fullDescription:
      "We develop high-performance desktop applications that work seamlessly across all platforms. Built with modern frameworks, our solutions deliver native performance with cross-platform compatibility, offline capabilities, and intuitive interfaces.",
    whatItMeans:
      "Desktop application development is creating software that runs directly on computers (Windows, macOS, Linux). These apps provide better performance, offline functionality, and direct access to system resources compared to web applications.",
    useCases: [
      "Professional productivity applications",
      "Video and image editing software",
      "Database management tools",
      "Software development tools and IDEs",
      "Enterprise desktop solutions",
      "Media player and media management apps",
    ],
    benefits: [
      "High performance and responsiveness",
      "Full offline functionality",
      "Direct access to system resources",
      "Familiar desktop user experience",
      "Better security and data control",
      "Seamless cross-platform distribution",
    ],
    technologies: [
      "Electron Framework",
      "Tauri Framework",
      "React Desktop Apps",
      "Native APIs",
      "Desktop UI/UX",
      "Auto-update Systems",
    ],
    features: [
      "Cross-Platform",
      "Electron/Tauri",
      "Native Performance",
      "Offline Capability",
    ],
  },
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    navigate("/");
    return null;
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
            className="mb-6 sm:mb-8 text-primary hover:text-secondary text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold gta-title">
                {service.title}
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl">
              {service.shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-3 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">Overview</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  {service.fullDescription}
                </p>
              </motion.div>

              {/* What It Means */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-3 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">What It Means</h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  {service.whatItMeans}
                </p>
              </motion.div>

              {/* Use Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">Use Cases</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {service.useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
                      <span className="text-xs sm:text-sm text-foreground">{useCase}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="gta-card p-4 sm:p-6 md:p-8"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-4 sm:mb-6">Benefits</h3>
                <div className="space-y-3 sm:space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex gap-2 sm:gap-3"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="gta-card p-4 sm:p-6 md:p-8"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-4 sm:mb-6">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {service.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-secondary/10 text-secondary rounded-full border border-secondary/20"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_hsl(276_100%_50%_/_0.3)]"
                >
                  Start Your Project
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
