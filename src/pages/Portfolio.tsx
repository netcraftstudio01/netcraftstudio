import { useState, useEffect, useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import portfolioBg from "@/assets/portfolio-bg.jpg";
import { ExternalLink, Github, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  getPortfolioCategories,
  type PortfolioProject,
} from "@/data/siteData";

const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: PortfolioProject; onOpenDetail: (project: PortfolioProject) => void }
>(
  ({ project, onOpenDetail }, ref) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -10 }}
        className="gta-card group overflow-hidden cursor-pointer"
        onClick={() => onOpenDetail(project)}
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

      <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-display uppercase tracking-wider text-secondary">
            {project.category}
          </span>
        </div>
        <h3 className="font-display text-base sm:text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground font-body text-xs sm:text-sm line-clamp-2">
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
  }
);

ProjectCard.displayName = "ProjectCard";

const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="gta-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="sticky top-4 right-4 float-right z-10 p-2 rounded-lg bg-primary/20 hover:bg-primary/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-display uppercase tracking-wider text-secondary">
                        {project.category}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-display font-bold gta-title mt-2">
                        {project.title}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        {project.year} • {project.client}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Full Description */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-display font-bold">About This Project</h3>
                      <p className="text-base text-foreground/80 leading-relaxed">
                        {project.fullDescription}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-display font-bold">Key Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {project.features.map((feature, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Technologies */}
                    <div className="gta-card p-6 space-y-4">
                      <h3 className="text-xl font-display font-bold">Technologies</h3>
                      <div className="space-y-2">
                        {project.technologies.map((tech, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-secondary/10 text-secondary text-sm border border-secondary/20"
                          >
                            {tech}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Tags */}
                    <div className="gta-card p-6 space-y-4">
                      <h3 className="text-xl font-display font-bold">Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_30px_hsl(276_100%_50%_/_0.3)]">
                            View Live Project
                          </Button>
                        </a>
                      )}
                      {project.sourceCodeUrl && (
                        <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full">
                            View Source Code
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Portfolio = () => {
  const { projects: dbProjects, loading, error } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Update projects when database data is loaded
  useEffect(() => {
    if (dbProjects.length > 0) {
      setProjects(dbProjects);
    }
  }, [dbProjects]);

  const categories = useMemo(
    () => getPortfolioCategories(projects),
    [projects]
  );

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleOpenDetail = (project: PortfolioProject) => {
    setSelectedProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-display text-xl mb-4">Error loading portfolio</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] py-10 sm:py-12 md:py-16 pt-24 sm:pt-32 md:pt-40 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={portfolioBg}
            alt="Portfolio background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/90 via-background/70 to-background" />

        <div className="hero-content container mx-auto px-4 sm:px-6 text-center">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black gta-title"
            >
              Portfolio
            </motion.h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground/80 font-body max-w-full mx-auto leading-relaxed px-4 sm:px-6 text-left">
              At NetCraft Studio, our portfolio is a showcase of innovation, performance, and bold digital craftsmanship. Every project we build is designed with precision, creativity, and a clear business goal—transforming ideas into powerful digital experiences.
              <br />
              <br />
              From web applications and custom software products to UI/UX-driven platforms and enterprise solutions, our work reflects a deep understanding of technology and modern design. We focus on scalability, speed, and immersive user experiences, ensuring each solution performs flawlessly in real-world environments.
              <br />
              <br />
              Our portfolio highlights our ability to adapt across industries, delivering tailored solutions that combine functionality, aesthetics, and reliability. Each project represents our commitment to quality, innovation, and long-term value for our clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 md:mb-16"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="min-w-[90px] text-sm sm:text-base"
              >
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <ProjectDetailModal 
        project={selectedProject} 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail}
      />

      <Footer />
    </div>
  );
};

export default Portfolio;
