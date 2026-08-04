import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

import NotFoundPage from "./components/NotFound";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import DiagonalCarousel from "./components/DiagonalCarousel";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import DesignGallery from "./components/DesignGallery";
import WebDesigns from "./components/WebDesigns";
import RippleDisplacementSlider from "./components/RippleSlider";
import Services from "./components/Services";
import DriveHub from "./components/DriveHub";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);

  // 🚀 Skills List with SVG Icon URLs
  const mySkills = [
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      title: "HTML5",
      alt: "HTML5 Icon"
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      title: "CSS3",
      alt: "CSS3 Icon"
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      title: "JavaScript",
      alt: "JavaScript Icon"
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      title: "React",
      alt: "React Icon"
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
      title: "Vite",
      alt: "Vite Icon"
    },
    {
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      title: "Python",
      alt: "Python Icon"
    }
  ];

  // 0. Check Route Path for 404
  useEffect(() => {
    if (window.location.pathname !== "/" && window.location.pathname !== "") {
      setIs404(true);
    }
  }, []);

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading || is404) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isLoading, is404]);

  if (is404) {
    return <NotFoundPage />;
  }

  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#050505] text-white">
          <div
            id="custom-cursor"
            className="hidden md:block pointer-events-none fixed z-50"
          />
          <div
            id="custom-cursor-magnetic"
            className="hidden md:block pointer-events-none fixed z-50"
          />

          <Navbar />

          <main>
            <Hero />
            <About />
            
            {/* 🎯 Diagonal Carousel Skills Section */}
            <div className="h-[450px] w-full max-w-6xl mx-auto my-12">
              <DiagonalCarousel items={mySkills} loop={true} />
            </div>

            <Skills />
            <Projects />
            <DesignGallery />
            <WebDesigns />
            {/* Three.js Ripple Slider Section */}
<div className="w-full max-w-6xl mx-auto px-4 my-12">
  <RippleDisplacementSlider />
</div>
            <Services />
            <DriveHub />
            <Testimonials />
            <Contact />
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}
