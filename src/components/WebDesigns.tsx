import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Layout } from "lucide-react";
import { WEB_DESIGNS, WebDesign } from "../data";
import gsap from "gsap";

function DesignCard({ design }: { design: WebDesign }) {
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
      className="flex-shrink-0 w-[280px] sm:w-[350px] h-[450px] glass-card rounded-3xl p-5 overflow-hidden flex flex-col justify-between transform-gpu select-none cursor-grab active:cursor-grabbing border border-white/5 shadow-2xl relative"
    >
      {/* Corner crosshairs decoration */}
      <span className="absolute top-2 left-2 text-[8px] text-white/10 font-mono">+</span>

      <div>
        {/* Website Preview Wrapper with Zoom Hover */}
        <div className="w-full h-56 rounded-2xl overflow-hidden relative group border border-white/5">
          <img
            src={design.image}
            alt={design.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          />
          {/* Deep dark gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent opacity-80"></div>
          
          {/* Top category indicator floating */}
          <div className="absolute top-3 left-3 bg-[#0d0d0d]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 text-[9px] font-mono tracking-wider uppercase text-white/60">
            {design.category}
          </div>
        </div>

        {/* Website Design Info */}
        <div className="mt-5 flex items-baseline justify-between gap-3">
          <h4 className="font-serif italic text-white text-lg sm:text-xl font-light tracking-wide truncate">
            {design.name}
          </h4>
          <span className="font-serif text-2xl font-bold tracking-tight text-white/10 select-none">
            {design.number}
          </span>
        </div>
      </div>

      <div>
        {/* Launch Preview glass button */}
        <button
          onClick={() => window.open("https://behance.net", "_blank")}
          className="w-full py-2.5 rounded-xl border border-white/10 bg-white/[0.01] hover:bg-white/10 text-[10px] tracking-widest font-mono text-white text-center flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-white/60" />
          <span>OPEN PREVIEW</span>
        </button>
      </div>
    </div>
  );
}

export default function WebDesigns() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag and Scroll Handler
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
      const walk = (x - startX) * 1.5;
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

  // Entrance Animation
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

            const cards = sliderRef.current?.querySelectorAll(".design-card-wrapper");
            if (cards) {
              gsap.fromTo(
                cards,
                { opacity: 0, x: -80, scale: 0.98 },
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

  const scrollSlider = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = direction === "left" ? -370 : 370;
    
    gsap.to(slider, {
      scrollLeft: slider.scrollLeft + scrollAmount,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative py-20 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] glow-purple opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Heading + Nav arrows */}
        <div ref={headingRef} className="flex items-end justify-between px-6 mb-12 opacity-0 transform-gpu">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-cyan-400 tracking-[0.4em] uppercase mb-3">
              VISUAL LAYOUTS
            </span>
            <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
              My Web Designs
            </h3>
          </div>
          
          {/* Manual Arrow Controls */}
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

        {/* Web Designs Carousel */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto py-6 px-6 no-scrollbar grab active:grabbing select-none"
          style={{ scrollBehavior: "auto" }}
        >
          {WEB_DESIGNS.map((design) => (
            <div key={design.id} className="design-card-wrapper opacity-0 transform-gpu">
              <DesignCard design={design} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 font-mono text-[9px] text-white/20 tracking-widest uppercase">
          ✦ HOLD AND DRAG OR SWIPE TO EXPLORE DESIGNS ✦
        </div>

      </div>
    </section>
  );
}
