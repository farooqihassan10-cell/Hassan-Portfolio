export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
  visitUrl: string;
  githubUrl: string;
}

export interface WebDesign {
  id: string;
  number: string;
  name: string;
  category: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  review: string;
  rating: number;
  image: string;
}

export interface Skill {
  name: string;
  percentage: number;
  icon: string;
  color: string;
}

export const SKILLS: Skill[] = [
  { name: "HTML", percentage: 95, icon: "html5", color: "from-orange-500 to-red-500" },
  { name: "CSS", percentage: 90, icon: "css3", color: "from-blue-500 to-indigo-500" },
  { name: "JavaScript", percentage: 92, icon: "js", color: "from-yellow-400 to-amber-500" },
  { name: "Blender", percentage: 85, icon: "blender", color: "from-orange-400 to-amber-600" },
  { name: "Canvas", percentage: 85, icon: "canvas", color: "from-emerald-400 to-teal-500" },
  { name: "Photoshop", percentage: 90, icon: "photoshop", color: "from-sky-500 to-blue-700" },
  { name: "Illustrator", percentage: 90, icon: "illustrator", color: "from-amber-600 to-orange-600" }
];

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    number: "01",
    name: "SaaS Dashboard",
    category: "Web Application",
    description: "An AI-powered analytics hub featuring real-time telemetry, predictive customer churn modeling, and beautifully dense data grid systems with custom canvas-rendered SVG visualizers.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "TypeScript", "Tailwind", "D3.js", "GSAP"],
    visitUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-2",
    number: "02",
    name: "E-Commerce Store",
    category: "Web Application",
    description: "High-end luxury fashion store powered by Stripe API, featuring high-fidelity fluid transitions, elegant filter systems, magnetic cart behaviors, and real-time stock sync.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Stripe", "Framer Motion", "Tailwind", "Node.js"],
    visitUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-3",
    number: "03",
    name: "AI Image Generator",
    category: "Web Application",
    description: "An award-winning generator utilizing state-of-the-art diffusion models to spawn stunning high-fidelity wallpapers, digital art, and isometric icons directly in-browser with seamless local cache storage.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "Gemini API", "Tailwind", "Webhooks", "LocalForage"],
    visitUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-4",
    number: "04",
    name: "3D Portfolio",
    category: "Web Application",
    description: "A highly interactive, award-winning 3D spatial catalog utilizing customized matrix transform coordinates and mathematical shader-based glassmorphism rendering layers.",
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "GSAP", "Canvas 3D", "CSS-3D", "Lenis"],
    visitUrl: "https://github.com",
    githubUrl: "https://github.com"
  },
  {
    id: "proj-5",
    number: "05",
    name: "Crypto Dashboard",
    category: "Web Application",
    description: "Real-time algorithmic trading interface with lightning-fast websocket charting, historical depth visualizers, glassmorphic metrics cards, and tactile audio feedback nodes.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80",
    tech: ["React", "WebSockets", "Recharts", "Tailwind", "GSAP"],
    visitUrl: "https://github.com",
    githubUrl: "https://github.com"
  }
];

export const WEB_DESIGNS: WebDesign[] = [
  {
    id: "design-1",
    number: "01",
    name: "Creative Agency",
    category: "Website Design",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "design-2",
    number: "02",
    name: "Startup Landing",
    category: "Website Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "design-3",
    number: "03",
    name: "Digital Studio",
    category: "Website Design",
    image: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "design-4",
    number: "04",
    name: "Architecture Firm",
    category: "Website Design",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "design-5",
    number: "05",
    name: "Personal Blog",
    category: "Website Design",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Ali Raza",
    company: "Tech Solutions",
    role: "CEO",
    review: "Hassan is an exceptional developer who delivers beyond expectations. Highly recommended!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-2",
    name: "Sarah Khan",
    company: "Marketing Head",
    role: "Marketing Head",
    review: "Amazing work on our website! The design and performance is top notch.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "test-3",
    name: "John Smith",
    company: "Entrepreneur",
    role: "Founder",
    review: "Professional, creative and super easy to work with. Will definitely work again!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  }
];
