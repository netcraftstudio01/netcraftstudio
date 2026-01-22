import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Linkedin, MessageCircle, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: MessageCircle, href: "https://wa.me/918122696986", label: "WhatsApp" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const footerLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative border-t border-border bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold gta-title">
              NetCraft<span className="text-secondary"> Studio</span>
            </h2>
            <p className="text-muted-foreground font-body">
              Crafting digital experiences that push boundaries.
              Service & Product based IT solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg text-primary uppercase tracking-wider">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-body"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-display text-lg text-primary uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-lg border border-border bg-card hover:border-primary hover:shadow-[0_0_15px_hsl(276_100%_50%_/_0.3)] transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © {currentYear} NetCraft Studio. All rights reserved.
          </p>
          {/* <p className="text-muted-foreground text-sm font-body">
            Designed with <span className="text-accent">♥</span> in the Digital Age
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
