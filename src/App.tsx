import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

import NotFoundPage from "./components/NotFound";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import DesignGallery from "./components/DesignGallery";
import WebDesigns from "./components/WebDesigns";
import InteractiveParticles from "./components/interactiveparticles";
import Services from "./components/Services";
import DriveHub from "./components/DriveHub";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [is404, setIs404] = useState(false);

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

  // 2. Custom Dual Cursor GSAP Orchestrator
  useEffect(() => {
    if (isLoading || is404) return;

    const cursor = document.getElementById("custom-cursor");
    const cursorMagnetic = document.getElementById("custom-cursor-magnetic");

    if (!cursor || !cursorMagnetic) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });

      gsap.to(cursorMagnetic, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.28,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.tagName === "A" ||
        target.closest("a") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".glass-card") ||
        target.closest("nav");

      if (isClickable) {
        document.body.classList.add("cursor-hover");
      } else {
        document.body.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("cursor-hover");
    };
  }, [isLoading, is404]);

  // If URL path is invalid, render 404 Game Page
  if (is404) {
    return <NotFoundPage />;
  }

  return (
    <>
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#050505] text-[#ffffff] overflow-hidden transform-gpu select-none">
          {/* Custom Cursor elements */}
          <div
            id="custom-cursor"
            className="hidden md:block pointer-events-none transform-gpu"
          />
          <div
            id="custom-cursor-magnetic"
            className="hidden md:block pointer-events-none transform-gpu"
          />

          {/* Core Layout Structure */}
          <Navbar />

          <main>
               <Hero />
               <About />
               <Skills />
               <Projects />
               <DesignGallery />
               <WebDesigns />
  
             {/* Interactive Particles Section */}
               <section className="w-full h-[500px] relative my-10">
                <InteractiveParticles 
                allowUpload={true} 
                uploadLabel="Upload Image to Particle"
                />
              </section>

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
