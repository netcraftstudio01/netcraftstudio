import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { clientsLogoCarousel } from "@/assets/clients";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import aboutBg from "@/assets/about-bg.jpg";
import themImage from "@/assets/team/me.jpg";
import team1 from "@/assets/team/prasanth.jpeg";
import team2 from "@/assets/team/gokul.jpeg";
import team3 from "@/assets/team/dharneesh.jpg";
import team4 from "@/assets/team/barath.jpg"
import team5 from "@/assets/team/kavya.jpg"
import team6 from "@/assets/team/keerthana.jpg"
import team7 from "@/assets/team/sanjai.jpg"
import { Users, Target, Rocket, Award } from "lucide-react";

const teamMembers = [
  {
    name: "Prasanth",
    role: "CEO & Founder",
    image: team1,
  },
  {
    name: "Thenmugilan",
    role: "Lead Developer",
    image: themImage,
  },
  {
    name: "Barath Nivash",
    role: "Backend Developer",
    image: team4,
  },
  {
    name: "Gokul",
    role: "Backend Developer",
    image: team2,
  },
  {
    name: "Sanjai Giri",
    role: "Full Stack Developer",
    image: team7,
  },
  {
    name: "Dharneesh",
    role: "Java Developer",
    image: team3,
  },
  {
    name: "Kaviya Shree",
    role: "Debug Engineer",
    image: team5,
  },
  {
    name: "Keerthana",
    role: "UI/UX Designer",
    image: team6,
  },
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
      <section className="hero-section min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] py-12 sm:py-16 md:py-20 pt-32 sm:pt-40 md:pt-48 flex items-center">
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
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black gta-title"
            >
              About Us
            </motion.h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground/80 font-body max-w-full mx-auto leading-relaxed px-4 sm:px-6 text-left">
              NetCraft Studio is a next-generation service and product based IT company driven by creativity, innovation, and precision engineering. We craft powerful digital experiences that blend cutting-edge technology with bold design, helping businesses stand out in a fast-moving digital world.
              <br />
              <br />
              Founded with a passion for building impactful solutions, NetCraft Studio specializes in web development, application development, UI/UX design, digital solutions, and custom software products. Our approach is simple—understand the vision, engineer the solution, and deliver excellence with performance, scalability, and style.
              <br />
              <br />
              At NetCraft Studio, we believe technology should not only function flawlessly but also feel immersive and engaging. Our team of skilled developers, designers, and strategists work collaboratively to transform ideas into reality, ensuring every product we deliver reflects quality, innovation, and reliability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold">
                <span className="gta-title">Our</span>{" "}
                <span className="text-secondary">Story</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-body text-base sm:text-lg leading-relaxed">
                <p>
                  NetCraft Studio was born from a simple idea — to build digital experiences that don't just work, but leave an impact.
                </p>
                <p>
                  What started as a small vision driven by curiosity and creativity soon evolved into a full-scale service and product based IT studio. From late-night brainstorming sessions to crafting real-world solutions, our journey has always been powered by innovation, precision, and a relentless drive to improve.
                </p>
                <p>
                  As technology evolved, so did we. NetCraft Studio expanded its expertise across web development, application development, UI/UX design, and custom software products, focusing on solutions that are fast, scalable, and future-ready. Every challenge became an opportunity, and every project pushed us to refine our craft.
                </p>
                <p>
                  Today, NetCraft Studio stands as a creative tech partner for startups, businesses, and enterprises—delivering solutions that combine strong engineering, bold design, and seamless user experience. Our story continues with every product we build, every client we collaborate with, and every idea we transform into reality.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              {[
                { icon: Users, label: "8+", text: "Team Members", color: "primary" },
                { icon: Target, label: "10+", text: "Projects Done", color: "secondary" },
                { icon: Rocket, label: "1+", text: "Years Experience", color: "accent" },
                // { icon: Award, label: "25+", text: "Awards Won", color: "primary" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="gta-card p-4 sm:p-6 text-center"
                >
                  <stat.icon className={`w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-3 sm:mb-4 text-${stat.color}`} />
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-body">{stat.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gta-title">Meet The</span>{" "}
              <span className="text-secondary">Team</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-body">
              The masterminds behind the digital magic
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
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
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gta-title">Trusted</span>{" "}
              <span className="text-secondary">Clients</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-body">
              Partnering with industry leaders worldwide
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-8 md:py-12"
          >
            <InfiniteSlider gap={32} duration={20} className="w-full">
              {clientsLogoCarousel.map((client) => {
                const ClientLogo = client.img;
                return (
                  <div key={client.id} className="flex-shrink-0">
                    <ClientLogo className="h-16 sm:h-20 w-24 sm:w-32 object-contain" />
                  </div>
                );
              })}
            </InfiniteSlider>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
