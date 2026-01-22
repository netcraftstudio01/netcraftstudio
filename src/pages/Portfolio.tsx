import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import portfolioBg from "@/assets/portfolio-bg.jpg";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All", "Web", "Mobile", "AI", "Cloud"];

const projects = [
  {
    id: 1,
    title: "Neon Commerce",
    category: "Web",
    description: "A next-gen e-commerce platform with AI-powered recommendations",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "AI"],
  },
  {
    id: 2,
    title: "CryptoVault",
    category: "Mobile",
    description: "Secure cryptocurrency wallet with biometric authentication",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    tags: ["React Native", "Blockchain", "Security"],
  },
  {
    id: 3,
    title: "MindFlow AI",
    category: "AI",
    description: "Intelligent workflow automation powered by machine learning",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    tags: ["Python", "TensorFlow", "ML"],
  },
  {
    id: 4,
    title: "CloudScale",
    category: "Cloud",
    description: "Enterprise-grade cloud infrastructure management dashboard",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    tags: ["AWS", "Kubernetes", "DevOps"],
  },
  {
    id: 5,
    title: "VirtualShowroom",
    category: "Web",
    description: "Immersive 3D product showcase with AR capabilities",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    tags: ["Three.js", "WebXR", "React"],
  },
  {
    id: 6,
    title: "HealthTrack Pro",
    category: "Mobile",
    description: "Comprehensive health monitoring and fitness tracking app",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
    tags: ["Swift", "HealthKit", "AI"],
  },
];

const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -10 }}
      className="gta-card group overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-primary/80 text-primary-foreground hover:bg-primary transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors"
          >
            <Github className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-display uppercase tracking-wider text-secondary">
            {project.category}
          </span>
        </div>
        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground font-body text-sm line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-body bg-muted text-muted-foreground rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <img
            src={portfolioBg}
            alt="Portfolio background"
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
              Portfolio
            </motion.h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-body max-w-3xl mx-auto">
              Explore our collection of groundbreaking projects that showcase
              innovation, creativity, and technical excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="min-w-[100px]"
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;
