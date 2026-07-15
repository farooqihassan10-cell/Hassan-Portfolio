import { useState, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import WebDesigns from "./components/WebDesigns";
import Services from "./components/Services";
import DriveHub from "./components/DriveHub";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard luxury easing
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
  }, [isLoading]);

  // 2. Custom Dual Cursor GSAP Orchestrator
  useEffect(() => {
    if (isLoading) return;

    const cursor = document.getElementById("custom-cursor");
    const cursorMagnetic = document.getElementById("custom-cursor-magnetic");

    if (!cursor || !cursorMagnetic) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Small glowing center dot - follows instantly
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out"
      });

      // Larger magnetic outer circle - organic lag delay
      gsap.to(cursorMagnetic, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.28,
        ease: "power3.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Apply interactive hover feedback on selectors
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
  }, [isLoading]);

  return (
    <>
      {/* Dynamic Cinematic Loader */}
      {isLoading ? (
        <Loader onComplete={() => setIsLoading(false)} />
      ) : (
        <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden transform-gpu select-none">
          
          {/* Custom Cursor elements */}
          <div id="custom-cursor" className="hidden md:block pointer-events-none transform-gpu" />
          <div id="custom-cursor-magnetic" className="hidden md:block pointer-events-none transform-gpu" />

          {/* Core Layout Structure */}
          <Navbar />
          
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
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
