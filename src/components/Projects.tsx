import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Code } from "lucide-react";
import { PROJECTS, Project } from "../data";
import gsap from "gsap";

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt on Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1200,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-[300px] sm:w-[380px] h-[520px] glass-card rounded-3xl p-5 overflow-hidden flex flex-col justify-between transform-gpu select-none cursor-grab active:cursor-grabbing border border-white/5 shadow-2xl relative"
    >
      {/* Corner crosshairs design */}
      <span className="absolute top-2 left-2 text-[8px] text-white/20 font-mono">+</span>
      <span className="absolute top-2 right-2 text-[8px] text-white/20 font-mono">+</span>

      <div>
        {/* Project Image Wrapper with Zoom Hover */}
        <div className="w-full h-48 rounded-2xl overflow-hidden relative group">
          <img
            src={project.image}
            alt={project.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none"
          />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-60"></div>
          
          {/* Top category label floating */}
          <div className="absolute top-3 left-3 bg-[#0d0d0d]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[9px] font-mono tracking-wider uppercase text-white/80">
            {project.category}
          </div>
        </div>

        {/* Project Info Block */}
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <h4 className="font-serif italic text-white text-xl md:text-2xl font-light tracking-wide truncate">
            {project.name}
          </h4>
          <span className="font-serif text-3xl font-bold tracking-tight text-white/10 select-none">
            {project.number}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-white/60 text-xs md:text-sm leading-relaxed tracking-wide font-sans line-clamp-3">
          {project.description}
        </p>
      </div>

      <div>
        {/* Tech Stack Icons Layout */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech.map((techItem, index) => (
            <span
              key={index}
              className="text-[9px] tracking-wider font-mono text-white/50 bg-white/[0.03] border border-white/5 px-2.5 py-1 rounded-md flex items-center gap-1 hover:border-white/15 transition-all"
            >
              <Code className="w-2.5 h-2.5 text-purple-400" />
              <span>{techItem}</span>
            </span>
          ))}
        </div>

        {/* Dynamic Launch/Code Buttons */}
        <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-4">
          <a
            href={project.visitUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/10 text-[10px] tracking-widest font-mono text-white text-center flex items-center justify-center gap-1.5 transition-all duration-300"
          >
            <span>LAUNCH APP</span>
            <ExternalLink className="w-3 h-3 text-white/60" />
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.06] hover:border-white/10 text-[10px] tracking-widest font-mono text-white/60 hover:text-white flex items-center justify-center transition-all duration-300"
            title="View Code on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse Drag to Scroll handlers
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      setIsDragging(false);
    };

    const handleMouseUp = () => {
      isDown = false;
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag speed coefficient
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Section Animation Entrance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
            );

            const cards = sliderRef.current?.querySelectorAll(".project-card-wrapper");
            if (cards) {
              gsap.fromTo(
                cards,
                { opacity: 0, x: 80, scale: 0.98 },
                { opacity: 1, x: 0, scale: 1, stagger: 0.1, duration: 1.4, ease: "power4.out" }
              );
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Manual Arrow Scroll Button controller
  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    
    gsap.to(slider, {
      scrollLeft: slider.scrollLeft + scrollAmount,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background neon ambient */}
      <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] glow-cyan opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Section Heading & Nav arrows */}
        <div ref={headingRef} className="flex items-end justify-between px-6 mb-12 opacity-0 transform-gpu">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
              CREATIVE LAB
            </span>
            <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
              My Projects
            </h3>
          </div>
          
          {/* Custom Slider Navigation Glass Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollSlider("left")}
              className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 text-white rounded-full transition-all duration-300 hover:bg-white/[0.08] active:scale-90 cursor-pointer"
              title="Scroll Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider("right")}
              className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 text-white rounded-full transition-all duration-300 hover:bg-white/[0.08] active:scale-90 cursor-pointer"
              title="Scroll Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Draggable Slider Container */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto py-6 px-6 no-scrollbar grab active:grabbing select-none"
          style={{ scrollBehavior: "auto" }}
        >
          {PROJECTS.map((project) => (
            <div key={project.id} className="project-card-wrapper opacity-0 transform-gpu">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Drag indicators */}
        <div className="flex justify-center mt-8 font-mono text-[9px] text-white/20 tracking-widest uppercase">
          ✦ HOLD AND DRAG OR SWIPE TO EXPLORE PROJECTS ✦
        </div>

      </div>
    </section>
  );
}
