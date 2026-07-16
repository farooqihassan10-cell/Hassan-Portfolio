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
    image: "/src/assets/images/web-project.png",
    tech: ["React", "TypeScript", "Tailwind", "D3.js", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-2",
    number: "02",
    name: "E-Commerce Store",
    category: "Web Application",
    description: "High-end luxury fashion store powered by Stripe API, featuring high-fidelity fluid transitions, elegant filter systems, magnetic cart behaviors, and real-time stock sync.",
    image: "/src/assets/images/web-project2.png",
    tech: ["React", "Stripe", "Framer Motion", "Tailwind", "Node.js"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-3",
    number: "03",
    name: "AI Generator Website",
    category: "Web Application",
    description: "An award-winning generator utilizing state-of-the-art diffusion models to spawn stunning high-fidelity wallpapers, digital art, and isometric icons directly in-browser with seamless local cache storage.",
    image: "/src/assets/images/web-project3.png",
    tech: ["Cloud", "Gemini", "Google AI Studio", "Chatgpt", "Black Box Ai"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-4",
    number: "04",
    name: "3D Portfolio",
    category: "Web Application",
    description: "A highly interactive, award-winning 3D spatial catalog utilizing customized matrix transform coordinates and mathematical shader-based glassmorphism rendering layers.",
    image: "/src/assets/images/web-project4.png",
    tech: ["React", "GSAP", "Canvas 3D", "CSS-3D", "Lenis"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-5",
    number: "05",
    name: "Coding Website",
    category: "Web Application",
    description: "Real-time algorithmic coding interface with lightning-fast websocket charting, historical depth visualizers, glassmorphic metrics cards, and tactile audio feedback nodes.",
    image: "/src/assets/images/web-project5.png",
    tech: ["React", "WebSockets", "Recharts", "Tailwind", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  }
];

export const WEB_DESIGNS: WebDesign[] = [
  {
    id: "design-1",
    number: "01",
    name: "Kitkate",
    category: "Poster Design",
    image: "/src/assets/images/project1.webp"
  },
  {
    id: "design-2",
    number: "02",
    name: "Starbucks",
    category: "Poster Design",
    image: "/src/assets/images/project2.png"
  },
  {
    id: "design-3",
    number: "03",
    name: "INCREDIBLE",
    category: "Poster Design",
    image: "/src/assets/images/project3.png"
  },
  {
    id: "design-4",
    number: "04",
    name: "Stqrtbucks Coffee",
    category: "Poster Design",
    image: "/src/assets/images/project4.png"
  },
  {
    id: "design-5",
    number: "05",
    name: "Don't Follow",
    category: "Poster Design",
    image: "/src/assets/images/project5.png"
  }
    {
    id: "design-6",
    number: "06",
    name: "Headphone ATS M15",
    category: "Poster Design",
    image: "/src/assets/images/project6.png"
  }
    {
    id: "design-7",
    number: "07",
    name: "PROMPTEURE",
    category: "Poster Design",
    image: "/src/assets/images/project7.png"
  }
    {
    id: "design-8",
    number: "08",
    name: "Dresing",
    category: "Poster Design",
    image: "/src/assets/images/project8.png"
  }
    {
    id: "design-9",
    number: "09",
    name: "Nike Air",
    category: "Poster Design",
    image: "/src/assets/images/project9.png"
  }
    {
    id: "design-10",
    number: "10",
    name: "Dresing",
    category: "Poster Design",
    image: "/src/assets/images/project10.png"
  }
    {
    id: "design-11",
    number: "11",
    name: "HIGHSNOBIETY",
    category: "Poster Design",
    image: "/src/assets/images/project11.png"
  }
    {
    id: "design-12",
    number: "12",
    name: "Pizza Hut",
    category: "Poster Design",
    image: "/src/assets/images/project12.png"
  }
    {
    id: "design-13",
    number: "13",
    name: "Focus Differend",
    category: "Poster Design",
    image: "/src/assets/images/project13.png"
  }
    {
    id: "design-14",
    number: "14",
    name: "PREMIUM",
    category: "Poster Design",
    image: "/src/assets/images/project14.png"
  }
    {
    id: "design-15",
    number: "15",
    name: "IPHONE 17",
    category: "Poster Design",
    image: "/src/assets/images/project15.png"
  }
    {
    id: "design-16",
    number: "16",
    name: "ELEGANCE",
    category: "Poster Design",
    image: "/src/assets/images/project16.png"
  }
    {
    id: "design-17",
    number: "17",
    name: "AI Genrate",
    category: "Poster Design",
    image: "/src/assets/images/project17.png"
  }

];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Ali",
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
