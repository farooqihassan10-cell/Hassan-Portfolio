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
import Services from "./components/Services";
import DriveHub from "./components/DriveHub";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);

  // Carousel Items Data
  const myProjects = [
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
      title: "UI Design Workflow",
      alt: "UI Design Workflow"
    },
    {
      src: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000",
      title: "Interactive Web App",
      alt: "Interactive Web App"
    },
    {
      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000",
      title: "Retro Arcade VOID",
      alt: "Retro Arcade VOID"
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
            
            {/* Diagonal Carousel Section */}
            <div className="h-[450px] w-full max-w-6xl mx-auto my-12">
              <DiagonalCarousel items={myProjects} loop={true} />
            </div>

            <Skills />
            <Projects />
            <DesignGallery />
            <WebDesigns />
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
