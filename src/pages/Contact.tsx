import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import contactBg from "@/assets/contact-bg.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "netcraftstudio01@gmail.com",
      color: "primary",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 8122696986",
      color: "secondary",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "coimbatore",
      color: "accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="noise-overlay" />
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] py-12 sm:py-16 md:py-20 pt-32 sm:pt-40 md:pt-48 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={contactBg}
            alt="Contact background"
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
              Contact Us
            </motion.h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground/80 font-body max-w-2xl mx-auto">
              Ready to start your next project? Let's create something amazing
              together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 md:space-y-12"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                  <span className="gta-title">Get In</span>{" "}
                  <span className="text-secondary">Touch</span>
                </h2>
                <p className="text-muted-foreground font-body text-base sm:text-lg">
                  Whether you have a project in mind, a question, or just want
                  to say hello – we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="gta-card p-4 sm:p-6 flex items-center gap-4 sm:gap-6 group"
                  >
                    <div className={`w-12 sm:w-14 h-12 sm:h-14 rounded-lg bg-${info.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <info.icon className={`w-5 sm:w-6 h-5 sm:h-6 text-${info.color}`} />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-body text-xs sm:text-sm">
                        {info.label}
                      </p>
                      <p className="text-foreground font-display text-base sm:text-lg">
                        {info.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="gta-card p-6 sm:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-display text-muted-foreground mb-2">
                      Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-display text-muted-foreground mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-display text-muted-foreground mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-display text-muted-foreground mb-2">
                      Subject
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Project inquiry"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-display text-muted-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us about your project..."
                    rows={6}
                    className="bg-background border-border focus:border-primary resize-none"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
