import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, FolderOpen, MessageSquare } from "lucide-react";

interface PreviewCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay: number;
  accentColor: "primary" | "secondary" | "accent";
}

const PreviewCard = ({
  title,
  description,
  icon,
  link,
  delay,
  accentColor,
}: PreviewCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const colorClasses = {
    primary: "border-primary/30 hover:border-primary hover:shadow-[0_0_30px_hsl(276_100%_50%_/_0.3)]",
    secondary: "border-secondary/30 hover:border-secondary hover:shadow-[0_0_30px_hsl(184_100%_48%_/_0.3)]",
    accent: "border-accent/30 hover:border-accent hover:shadow-[0_0_30px_hsl(330_100%_59%_/_0.3)]",
  };

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={`gta-card group p-8 border-2 ${colorClasses[accentColor]} transition-all duration-500`}
    >
      <div className="space-y-4">
        <div className={`w-14 h-14 rounded-lg bg-card flex items-center justify-center ${iconColorClasses[accentColor]} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="font-display text-2xl text-foreground group-hover:gta-title transition-all duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground font-body leading-relaxed">
          {description}
        </p>
        <Link to={link}>
          <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-secondary">
            Explore More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const PreviewSection = () => {
  const sections = [
    {
      title: "About Us",
      description: "Discover our journey, meet the team behind the magic, and learn what drives our passion for digital excellence.",
      icon: <Users className="w-7 h-7" />,
      link: "/about",
      accentColor: "primary" as const,
    },
    {
      title: "Services",
      description: "From web development to AI solutions, explore our comprehensive suite of IT services tailored to your needs.",
      icon: <Briefcase className="w-7 h-7" />,
      link: "/services",
      accentColor: "secondary" as const,
    },
    {
      title: "Portfolio",
      description: "Witness our craft through groundbreaking projects that have transformed businesses worldwide.",
      icon: <FolderOpen className="w-7 h-7" />,
      link: "/portfolio",
      accentColor: "accent" as const,
    },
    {
      title: "Contact Us",
      description: "Ready to start your next project? Let's connect and turn your vision into digital reality.",
      icon: <MessageSquare className="w-7 h-7" />,
      link: "/contact",
      accentColor: "primary" as const,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gta-title">What We</span>{" "}
            <span className="text-secondary">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Navigate through our world of digital innovation and excellence
          </p>
        </motion.div>

        {/* Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <PreviewCard key={section.title} {...section} delay={index * 0.15} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
