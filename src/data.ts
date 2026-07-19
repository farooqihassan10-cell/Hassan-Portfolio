import project1 from "./assets/images/project1.webp";
import project2 from "./assets/images/project2.png";
import project3 from "./assets/images/project3.png";
import project4 from "./assets/images/project4.png";
import project5 from "./assets/images/project5.png";
import project6 from "./assets/images/project6.png";
import project7 from "./assets/images/project7.png";
import project8 from "./assets/images/project8.png";
import project9 from "./assets/images/project9.png";
import project10 from "./assets/images/project10.png";
import project11 from "./assets/images/project11.png";
import project12 from "./assets/images/project12.png";
import project13 from "./assets/images/project13.png";
import project14 from "./assets/images/project14.png";
import project15 from "./assets/images/project15.png";
import project16 from "./assets/images/project16.png";
import project17 from "./assets/images/project17.png";

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

import webProject1 from "./assets/images/web-project1.png";
import webProject2 from "./assets/images/web-project2.png";
import webProject3 from "./assets/images/web-project3.png";
import webProject4 from "./assets/images/web-project4.png";
import webProject5 from "./assets/images/web-project5.png";
import webProject6 from "./assets/images/web-project6.png";

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
  { name: "JavaScript", percentage: 65, icon: "js", color: "from-yellow-400 to-amber-500" },
  { name: "Blender", percentage: 85, icon: "blender", color: "from-orange-400 to-amber-600" },
  { name: "Canvas", percentage: 85, icon: "canvas", color: "from-emerald-400 to-teal-500" },
  { name: "Photoshop", percentage: 90, icon: "photoshop", color: "from-sky-500 to-blue-700" },
  { name: "Illustrator", percentage: 90, icon: "illustrator", color: "from-amber-600 to-orange-600" }
];


    export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    number: "01",
    name: "KitKat",
    category: "Poster Design",
    description: "A premium chocolate advertisement poster featuring bold typography, vibrant colors, and a visually engaging product-focused composition.",
    image: project1,
    tech: ["Photoshop", "Illustrator", "Typography", "Branding", "Mockup"]
,
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-2",
    number: "02",
    name: "STARBUCKS",
    category: "Poster Design",
    description: "A modern coffee promotional poster designed with elegant branding, premium aesthetics, and eye-catching visual storytelling.",
    image: project2,
    tech: ["Photoshop", "Illustrator", "Product Design", "Typography", "Branding"]
,
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-3",
    number: "03",
    name: "INCREDIBLE",
    category: "Poster Design",
    description: "A bold cinematic poster with creative typography, dramatic lighting, and a powerful composition for maximum visual impact.",
    image: project3,
    tech: ["Cloud", "Gemini", "Google AI Studio", "ChatGPT", "Black Box AI"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-4",
    number: "04",
    name: "STARBUCKS COFFEE",
    category: "Poster Design",
    description: "A luxury coffee campaign poster combining clean layouts, premium branding, and modern design principles.",
    image: project4,
    tech: ["React", "GSAP", "Canvas 3D", "CSS-3D", "Lenis"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "proj-5",
    number: "05",
    name: "Don't Follow",
    category: "Poster Design",
    description: "A motivational social awareness poster featuring bold typography, creative composition, and a strong visual message.",
    image: project5,
    tech: ["React", "WebSockets", "Recharts", "Tailwind", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
  id: "proj-6",
  number: "06",
  name: "Headphone ATS M15",
  category: "Poster Design",
  description: "A premium product advertisement poster highlighting sleek design, modern lighting effects, and professional marketing visuals.",
  image: project6,
  tech: ["Photoshop", "Product Advertisement", "Photo Manipulation", "Typography", "Mockup"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-7",
  number: "07",
  name: "PROMPTEURE",
  category: "Poster Design",
  description: "A futuristic AI-inspired promotional poster designed with minimal aesthetics, modern typography, and premium branding.",
  image: project7,
  tech: ["Photoshop", "AI Design", "Typography", "Branding", "Creative Layout"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-8",
  number: "08",
  name: "Dressing",
  category: "Poster Design",
  description: "A stylish fashion poster showcasing luxury apparel with elegant layouts, bold visuals, and modern branding.",
  image: project8,
  tech: ["Photoshop", "Fashion Design", "Typography", "Brand Identity", "Mockup"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-9",
  number: "09",
  name: "Nike Air",
  category: "Poster Design",
  description: "A high-end sneaker advertisement poster featuring dynamic composition, premium product presentation, and bold typography.",
  image: project9,
  tech: ["Photoshop", "Sports Branding", "Product Design", "Typography", "Advertising"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-10",
  number: "10",
  name: "Dressing",
  category: "Poster Design",
  description: "A contemporary fashion campaign poster with clean aesthetics, premium visuals, and luxury brand styling.",
  image: project10,
  tech: ["Photoshop", "Fashion Branding", "Typography", "Creative Layout", "Mockup"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-11",
  number: "11",
  name: "HIGHSNOBIETY",
  category: "Poster Design",
  description: "A modern editorial-style poster combining luxury fashion branding, bold typography, and premium visual balance.",
  image: project11,
  tech: ["Photoshop", "Editorial Design", "Typography", "Magazine Style", "Branding"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-12",
  number: "12",
  name: "Pizza Hut",
  category: "Poster Design",
  description: "A mouth-watering food advertisement poster designed with vibrant colors, premium product presentation, and engaging visuals.",
  image: project12,
  tech: ["Photoshop", "Food Advertisement", "Typography", "Brand Identity", "Photo Editing"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-13",
  number: "13",
  name: "Focus Different",
  category: "Poster Design",
  description: "A creative motivational poster emphasizing innovation, unique thinking, and modern visual storytelling.",
  image: project13,
  tech: ["Photoshop", "Creative Design", "Typography", "Branding", "Advertising"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-14",
  number: "14",
  name: "PREMIUM",
  category: "Poster Design",
  description: "A luxury branding poster featuring elegant typography, minimalist composition, and a sophisticated visual identity.",
  image: project14,
  tech: ["Photoshop", "Luxury Branding", "Minimal Design", "Typography", "Mockup"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-15",
  number: "15",
  name: "IPHONE 17",
  category: "Poster Design",
  description: "A futuristic smartphone launch poster showcasing premium product rendering, clean aesthetics, and modern technology branding.",
  image: project15,
  tech: ["Photoshop", "Product Design", "Technology Branding", "Typography", "3D Mockup"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-16",
  number: "16",
  name: "ELEGANCE",
  category: "Poster Design",
  description: "A luxury lifestyle poster designed with refined typography, premium color harmony, and sophisticated visual appeal.",
  image: project16,
  tech: ["Photoshop", "Luxury Design", "Typography", "Brand Identity", "Creative Layout"],
  visitUrl: "#",
  githubUrl: "#"
},
{
  id: "proj-17",
  number: "17",
  name: "AI Generate",
  category: "Poster Design",
  description: "A modern AI-inspired promotional poster highlighting creativity, advanced technology, and futuristic visual design.",
  image: project17,
  tech: ["Photoshop", "AI Art", "Creative Design", "Typography", "Digital Branding"],
  visitUrl: "#",
  githubUrl: "#"
}
];

export const WEB_DESIGNS: WebDesign[] = [
  {
    id: "web-design-1",
    number: "01",
    name: "Music Muzium",
    category: "Web Design",
    description:"A Music platform with secure checkout, product filtering, responsive design, fast loading speed, and a premium shopping experience for customers.",
    image: webProject1,
    tech: ["React", "TypeScript", "Tailwind", "D3.js", "GSAP"],
    visitUrl: "https://music-muzium.ai.studio",
    githubUrl: "https://music-muzium.ai.studio"
  },
  {
    id: "web-design-2",
    number: "02",
    name: "Data Access",
    category: "Web Design",
    description: "A modern coding platform featuring a clean developer interface, real-time code previews, responsive design, optimized performance, and an intuitive user experience.",
    image: webProject2,
    tech: ["React", "Tailwind", "Firebase", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "web-design-3",
    number: "03",
    name: "Portfolio",
    category: "Web Design",
    description: "A luxury portfolio website crafted with premium UI/UX, cinematic animations, interactive sections, glassmorphism aesthetics, and fully responsive performance to professionally showcase creative work and personal brand.",
    image: webProject3,
    tech: ["Cloud", "Gemini", "Google AI Studio", "ChatGPT", "Black Box AI"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "web-design-4",
    number: "04",
    name: "3D Desgin",
    category: "Web Design",
    description: "A futuristic 3D portfolio website with immersive animations, glassmorphism effects, smooth transitions, interactive sections, and a premium visual experience.",
    image: webProject4,
    tech: ["React", "GSAP", "Canvas 3D", "CSS-3D", "Lenis"],
    visitUrl: "#",
    githubUrl: "#"
  },
  {
    id: "web-design-5",
    number: "05",
    name: "Advance Codes",
    category: "Web Design",
    description: "An advanced AI-powered website integrating modern automation tools, intelligent workflows, clean interfaces, and high-performance user interactions.",
    image: webProject5,
    tech: ["React", "WebSockets", "Recharts", "Tailwind", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  },
{
    id: "web-design-6",
    number: "06",
    name: "Advance Codes",
    category: "Web Design",
    description: "An advanced AI-powered website integrating modern automation tools, intelligent workflows, clean interfaces, and high-performance user interactions.",
    image: webProject5,
    tech: ["React", "WebSockets", "Recharts", "Tailwind", "GSAP"],
    visitUrl: "#",
    githubUrl: "#"
  },
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
    rating: 6,
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
