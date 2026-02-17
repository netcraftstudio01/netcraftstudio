import uzhavImg from "@/assets/clients/Uzhavar Connect Logo.jpg";
import amirdhImg from "@/assets/clients/Amirdha Stickers logo.jpeg";
import adhivelanImg from "@/assets/clients/Adhivelan Masala Logo.png";
import sasthImg from "@/assets/clients/sri-sastha-travels.jpeg";
import prasanthImg from "@/assets/team/prasanth.jpeg";
import thenmugilanImg from "@/assets/team/thenmugilan.jpg";
import barathImg from "@/assets/team/barath.jpg";
import gokulImg from "@/assets/team/gokul.jpeg";
import pavithraImg from "@/assets/team/pavithra.jpeg";
import kavyaImg from "@/assets/team/kavya.jpg";
import keerthanaImg from "@/assets/team/keerthana.jpg";

export type PortfolioProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  features: string[];
  technologies: string[];
  year: string;
  client: string;
  liveUrl?: string;
  sourceCodeUrl?: string;
};

export type Client = {
  id: number;
  name: string;
  image: string;
  alt?: string;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
};

const STORAGE_KEYS = {
  portfolio: "ncs-portfolio-projects",
  clients: "ncs-clients",
  team: "ncs-team",
};

const DEFAULT_CATEGORIES = [
  "Web",
  "Mobile",
  "Management",
  "Travel",
  "E-commerce",
  "Desktop Application",
];

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Prasanth",
    role: "CEO & Founder",
    image: prasanthImg,
  },
  {
    id: 2,
    name: "Thenmugilan",
    role: "Lead Developer",
    image: thenmugilanImg,
  },
  {
    id: 3,
    name: "Barath Nivash",
    role: "Backend Developer",
    image: barathImg,
  },
  {
    id: 4,
    name: "Gokul",
    role: "Backend Developer",
    image: gokulImg,
  },
  {
    id: 5,
    name: "Pavithra",
    role: "Admin",
    image: pavithraImg,
  },
  {
    id: 6,
    name: "Kaviya Shree",
    role: "Debug Engineer",
    image: kavyaImg,
  },
  {
    id: 7,
    name: "Keerthana",
    role: "UI/UX Designer",
    image: keerthanaImg,
  },
];

const TEAM_IMAGE_MAP = new Map<number, string>(
  DEFAULT_TEAM_MEMBERS.map((member) => [member.id, member.image])
);

const DEFAULT_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 1,
    title: "Fine Management System",
    category: "Web",
    description: "Complete fine management system for traffic violations and penalties tracking",
    fullDescription:
      "A comprehensive fine management system designed for traffic authorities and municipal corporations. The system enables efficient tracking, management, and collection of traffic fines with digital payment integration and automated notifications.",
    image: "/portfolio/fine-management-system.png",
    tags: ["React", "Node.js", "Database"],
    features: [
      "Violation tracking",
      "Fine calculation",
      "Payment integration",
      "Automated notifications",
      "Report generation",
      "Offline support",
    ],
    technologies: ["PHP", "My SQL", "HTML", "CSS", "JS", "Payment Gateway"],
    year: "2024",
    client: "Municipal Corporation",
    liveUrl: undefined,
    sourceCodeUrl: undefined,
  },
  {
    id: 2,
    title: "Employee Attendance System",
    category: "Web",
    description: "Comprehensive employee attendance tracking and reporting system",
    fullDescription:
      "A modern attendance management system that streamlines employee check-in/check-out processes with real-time reporting, analytics, and integration with payroll systems. Includes facial recognition and biometric support.",
    image: "/portfolio/employee-attendance-system.png",
    tags: ["React", "Express", "MongoDB"],
    features: [
      "Facial recognition",
      "Real-time tracking",
      "Attendance reports",
      "Payroll integration",
      "Leave management",
      "Mobile access",
    ],
    technologies: ["React.js", "Node.js", "MongoDB", "Express", "JWT Authentication"],
    year: "2024",
    client: "Enterprise Corporation",
    liveUrl: "https://employee-attendance-frontend-wga0.onrender.com",
    sourceCodeUrl: undefined,
  },
  {
    id: 3,
    title: "Student QR Attendance System",
    category: "Mobile",
    description: "QR code-based attendance system for educational institutions",
    fullDescription:
      "An innovative QR code-based attendance solution for educational institutions that simplifies the attendance marking process. Students scan QR codes to mark attendance, and teachers get real-time reports and analytics.",
    image: "/portfolio/student-attendance-system.png",
    tags: ["React Native", "QR Code", "Firebase"],
    features: [
      "QR code scanning",
      "Real-time attendance",
      "Class reports",
      "Parent notifications",
      "Analytics dashboard",
      "Offline mode",
    ],
    technologies: ["Next JS", "Supabase", "QR Code Library", "Expo"],
    year: "2024",
    client: "Educational Institution",
    liveUrl: "https://attendance-management-system-rho-seven.vercel.app/students",
    sourceCodeUrl: undefined,
  },
  {
    id: 4,
    title: "Event Registration",
    category: "Web",
    description: "Full-featured event registration and ticket management platform",
    fullDescription:
      "A comprehensive event management platform that handles registration, ticketing, seat allocation, and attendance tracking. Supports multiple event types and integrated payment processing.",
    image: "/portfolio/event-registration.jpg",
    tags: ["React", "Stripe", "Node.js"],
    features: [
      "Registration management",
      "Ticket generation",
      "Seat allocation",
      "Payment processing",
      "Email notifications",
      "Check-in system",
    ],
    technologies: ["React.js", "Spring Boot", "Supabase"],
    year: "2024",
    client: "Event Management Company",
    liveUrl: undefined,
    sourceCodeUrl: undefined,
  },
  {
    id: 5,
    title: "E-Commerce Platform",
    category: "E-commerce",
    description: "Complete e-commerce platform with shopping cart and payment integration",
    fullDescription:
      "A full-stack e-commerce platform with product catalog, shopping cart, secure checkout, order tracking, and inventory management. Features advanced search, filtering, and recommendation engine.",
    image: "/portfolio/ecommerce.jpg",
    tags: ["Next.js", "Shopify", "Tailwind"],
    features: [
      "Product catalog",
      "Shopping cart",
      "Secure checkout",
      "Order tracking",
      "Inventory management",
      "User reviews",
    ],
    technologies: ["Next.js", "Supabase", "Tailwind CSS"],
    year: "2024",
    client: "Retail Business",
    liveUrl: undefined,
    sourceCodeUrl: undefined,
  },
  {
    id: 6,
    title: "Uzhavar Connect",
    category: "E-commerce",
    description: "Agricultural marketplace connecting farmers directly to consumers",
    fullDescription:
      "A digital marketplace platform that bridges the gap between farmers and consumers, enabling direct sales of fresh produce. Includes supply chain tracking, quality assurance, and logistics management.",
    image: "/portfolio/uzhavar.png",
    tags: ["React", "Node.js", "Maps API"],
    features: [
      "Farmer profiles",
      "Product listings",
      "Order management",
      "GPS tracking",
      "Quality verification",
      "Payment settlement",
    ],
    technologies: ["React.js", "Node.js", "Leafleat API", "Supabase", "Cloudinary", "Google Sheets"],
    year: "2025",
    client: "Agricultural Organization",
    liveUrl: "https://www.uzhavarconnect.com/",
    sourceCodeUrl: undefined,
  },
  {
    id: 7,
    title: "Amirdha Stickers",
    category: "E-commerce",
    description: "Creative sticker and design e-commerce store with custom orders",
    fullDescription:
      "A specialized e-commerce store for custom stickers and designs with real-time design customization, preview, and fast turnaround production. Integrated with manufacturing partners.",
    image: "/portfolio/amirdha-stickers.png",
    tags: ["React JS", "Node Mailer", "Bootstrap"],
    features: [
      "Design customization",
      "Live preview",
      "Bulk ordering",
      "Fast shipping",
      "Quality guarantee",
      "Design templates",
    ],
    technologies: ["React JS", "Node Mailer", "Bootstrap"],
    year: "2025",
    client: "Creative Business",
    liveUrl: "https://amirdhastickers.com/",
    sourceCodeUrl: undefined,
  },
  {
    id: 8,
    title: "Sastha Travels",
    category: "Travel",
    description: "Travel booking and itinerary management system for tourism packages",
    fullDescription:
      "A comprehensive travel booking platform offering tour packages, hotel reservations, flight bookings, and itinerary customization. Includes multi-language support and real-time pricing.",
    image: "/portfolio/sri-sastha-travels.png",
    tags: ["React", "Payment Gateway", "Maps"],
    features: [
      "Package booking",
      "Hotel integration",
      "Flight search",
      "Itinerary builder",
      "Travel guides",
      "Multi-language support",
    ],
    technologies: ["React.js", "Node.js", "Travel APIs", "Google Maps", "Payment Gateways"],
    year: "2024",
    client: "Travel Agency",
    liveUrl: "https://sri-sastha-travels.vercel.app/",
    sourceCodeUrl: undefined,
  },
  {
    id: 9,
    title: "Campus Navigation Map",
    category: "Web",
    description: "Interactive campus mapping system with navigation and location services",
    fullDescription:
      "An interactive map system for university campuses providing real-time navigation, location finder for buildings and facilities, event announcements, and student services directory.",
    image: "/portfolio/campus-navigation.jpg",
    tags: ["Leaflet", "React", "Geolocation"],
    features: [
      "Interactive maps",
      "Location search",
      "Route planning",
      "Facility directory",
      "Event locations",
      "Real-time updates",
    ],
    technologies: ["React.js", "Bootstrap"],
    year: "2023",
    client: "University",
    liveUrl: undefined,
    sourceCodeUrl: undefined,
  },
  {
    id: 10,
    title: "Billing System",
    category: "Desktop Application",
    description: "Automated billing and invoicing system with payment tracking",
    fullDescription:
      "A powerful desktop application for automated billing and invoice generation with payment tracking, financial reporting, tax calculations, and customer management features.",
    image: "/portfolio/billing-system.jpg",
    tags: ["Node.js", "PostgreSQL", "PDF Generation"],
    features: [
      "Invoice generation",
      "Payment tracking",
      "Financial reports",
      "Tax calculations",
      "Customer management",
      "PDF export",
    ],
    technologies: ["Electron JS"],
    year: "2024",
    client: "Financial Services",
    liveUrl: undefined,
    sourceCodeUrl: undefined,
  },
  {
    id: 11,
    title: "Accounting System",
    category: "Management",
    description: "Complete accounting and financial management software solution",
    fullDescription:
      "A comprehensive accounting software for managing ledgers, financial statements, expense tracking, budget management, and compliance reporting with multi-company support.",
    image: "/portfolio/accounting-system.png",
    tags: ["React", "Chart.js", "Financial APIs"],
    features: [
      "Ledger management",
      "Financial statements",
      "Expense tracking",
      "Budget planning",
      "Compliance reports",
      "Data analytics",
    ],
    technologies: ["React.js", "Electron JS"],
    year: "2025",
    client: "Accounting Firm",
    liveUrl: undefined,
    sourceCodeUrl: "https://github.com/netcraftstudio01/Accounting-System-Template.git",
  },
];

const DEFAULT_CLIENTS: Client[] = [
  {
    id: 1,
    name: "Uzhavar Connect",
    image: uzhavImg,
    alt: "Uzhavar Connect",
  },
  {
    id: 2,
    name: "Amirdha Stickers",
    image: amirdhImg,
    alt: "Amirdha Stickers",
  },
  {
    id: 3,
    name: "Adhivelan Masala",
    image: adhivelanImg,
    alt: "Adhivelan Masala",
  },
  {
    id: 4,
    name: "Sri Sastha Travels",
    image: sasthImg,
    alt: "Sri Sastha Travels",
  },
];

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures (quota, privacy mode, etc.).
  }
};

const notifyDataUpdated = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("ncs-data-updated"));
};

export const getPortfolioProjects = () =>
  readStorage(STORAGE_KEYS.portfolio, DEFAULT_PORTFOLIO_PROJECTS);

export const setPortfolioProjects = (projects: PortfolioProject[], notify = true) => {
  writeStorage(STORAGE_KEYS.portfolio, projects);
  if (notify) notifyDataUpdated();
};

export const getClients = () => readStorage(STORAGE_KEYS.clients, DEFAULT_CLIENTS);

export const setClients = (clients: Client[], notify = true) => {
  writeStorage(STORAGE_KEYS.clients, clients);
  if (notify) notifyDataUpdated();
};

export const getTeamMembers = () => {
  const storedTeam = readStorage(STORAGE_KEYS.team, DEFAULT_TEAM_MEMBERS);

  return storedTeam.map((member) => {
    const needsDefaultImage =
      !member.image || member.image.startsWith("/src/assets/team/");

    if (!needsDefaultImage) return member;

    return {
      ...member,
      image: TEAM_IMAGE_MAP.get(member.id) || member.image,
    };
  });
};

export const setTeamMembers = (team: TeamMember[]) => {
  writeStorage(STORAGE_KEYS.team, team);
  notifyDataUpdated();
};

export const getPortfolioCategories = (projects: PortfolioProject[]) => {
  const categoriesInUse = Array.from(new Set(projects.map((project) => project.category)));
  const ordered = DEFAULT_CATEGORIES.filter((category) =>
    categoriesInUse.includes(category)
  );
  const extras = categoriesInUse.filter(
    (category) => !DEFAULT_CATEGORIES.includes(category)
  );
  return ["All", ...ordered, ...extras];
};
