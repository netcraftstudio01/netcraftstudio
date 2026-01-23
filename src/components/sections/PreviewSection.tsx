import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, FolderOpen, MessageSquare } from "lucide-react";

const PreviewSection = () => {
  const sections = [
    {
      title: "About Us",
      description: "NetCraft Studio is where technology meets attitude. We are a service and product based IT company creating bold, high-performance digital solutions for modern businesses. From concept to execution, we design and build experiences that are fast, scalable, and visually powerful. Our team thrives on innovation, precision, and creativity—delivering custom software, web solutions, and digital products that help brands dominate the digital landscape.",
      icon: <Users className="w-8 h-8" />,
      link: "/about",
      imagePosition: "right" as const,
      imageBg: "/img/about-us.jpg",
      isImage: true,
    },
    {
      title: "Portfolio",
      description: "Witness our craft through groundbreaking projects that have transformed businesses worldwide. Explore our collection of innovative solutions across web development, mobile applications, and custom software that showcase our expertise and dedication to excellence.",
      icon: <FolderOpen className="w-8 h-8" />,
      link: "/portfolio",
      imagePosition: "left" as const,
      imageBg: "/img/port.png",
      isImage: true,
    },
    {
      title: "Services",
      description: "From web development to AI solutions, explore our comprehensive suite of IT services tailored to your needs. We deliver cutting-edge technology solutions that drive business growth, enhance user experience, and provide sustainable competitive advantages.",
      icon: <Briefcase className="w-8 h-8" />,
      link: "/services",
      imagePosition: "right" as const,
      imageBg: "/img/service.jpg",
      isImage: true,
    },
    {
      title: "Contact Us",
      description: "Ready to start your next project? Let's connect and turn your vision into digital reality. Our team is eager to discuss your ideas and help you achieve your business goals.",
      icon: <MessageSquare className="w-8 h-8" />,
      link: "/contact",
      imagePosition: "center" as const,
      imageBg: "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20",
    },
  ];

  return (
    <>
      {sections.map((section, index) => (
        <section key={section.title} className="w-full py-12 md:py-20 lg:py-32 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={section.imagePosition === "center" ? "text-center max-w-2xl mx-auto space-y-6 md:space-y-8" : ""}
            >
              {section.imagePosition === "center" ? (
                // Contact Us - Center Layout
                <div className="space-y-4 md:space-y-6">
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg bg-card flex items-center justify-center mx-auto text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
                    <span className="gta-title">{section.title}</span>
                  </h2>
                  <p className="text-muted-foreground font-body text-base sm:text-lg leading-relaxed">
                    {section.description}
                  </p>
                  <Link to={section.link}>
                    <Button className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg">
                      Get Started
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : section.imagePosition === "right" ? (
                // Content Left, Image Right
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg bg-card flex-shrink-0 flex items-center justify-center text-primary">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold gta-title">
                        {section.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground font-body text-sm sm:text-base md:text-lg leading-relaxed">
                      {section.description}
                    </p>
                    <Link to={section.link}>
                      <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-secondary">
                        Explore More
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                  <div className={`${!section.isImage ? section.imageBg : 'bg-cover bg-center'} h-56 sm:h-64 md:h-80 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10`} style={section.isImage ? { backgroundImage: `url(${section.imageBg})` } : {}}>
                    {!section.isImage && (
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl md:text-6xl opacity-50">{section.icon}</div>
                        <p className="text-muted-foreground mt-2 sm:mt-4 text-xs sm:text-sm">Image Placeholder</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Content Right, Image Left
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                  <div className={`${!section.isImage ? section.imageBg : 'bg-cover bg-center'} h-56 sm:h-64 md:h-80 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 order-2 md:order-1`} style={section.isImage ? { backgroundImage: `url(${section.imageBg})` } : {}}>
                    {!section.isImage && (
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl md:text-6xl opacity-50">{section.icon}</div>
                        <p className="text-muted-foreground mt-2 sm:mt-4 text-xs sm:text-sm">Image Placeholder</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 md:space-y-6 order-1 md:order-2">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg bg-card flex-shrink-0 flex items-center justify-center text-accent">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold gta-title">
                        {section.title}
                      </h2>
                    </div>
                    <p className="text-muted-foreground font-body text-sm sm:text-base md:text-lg leading-relaxed">
                      {section.description}
                    </p>
                    <Link to={section.link}>
                      <Button variant="ghost" className="group/btn p-0 h-auto text-secondary hover:text-primary">
                        Explore More
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      ))}
    </>
  );
};

export default PreviewSection;
