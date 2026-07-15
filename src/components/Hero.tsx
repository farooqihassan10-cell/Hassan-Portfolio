import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Download, ArrowDown } from "lucide-react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  
  const glassTopRef = useRef<HTMLDivElement>(null);
  const glassBottomRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Sound/Click Ripple effect
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = "absolute bg-white/20 rounded-full pointer-events-none scale-0 animate-ping";
    
    // Add to button, remove after animation completes
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // Canvas star particles background effect
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random();
        this.opacitySpeed = 0.005 + Math.random() * 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Pulsating opacity
        this.opacity += this.opacitySpeed;
        if (this.opacity > 1 || this.opacity < 0.1) {
          this.opacitySpeed = -this.opacitySpeed;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(this.opacity, 0.7))})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from({ length: 80 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle warm core glow
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        width * 0.7
      );
      gradient.addColorStop(0, "rgba(10, 10, 10, 0.2)");
      gradient.addColorStop(0.5, "rgba(5, 5, 5, 0.4)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // GSAP Cinematic Entrance Animations
  useEffect(() => {
    // Top glass bar swiping in from LEFT to CENTER
    gsap.fromTo(
      glassTopRef.current,
      { x: "-100vw" },
      {
        x: "0vw",
        duration: 1.8,
        ease: "power4.out",
        delay: 0.5,
      }
    );

    // Bottom glass bar swiping in from RIGHT to CENTER with delay
    gsap.fromTo(
      glassBottomRef.current,
      { x: "100vw" },
      {
        x: "0vw",
        duration: 1.8,
        ease: "power4.out",
        delay: 0.65,
      }
    );

    // Fade + Scale Year Badge 2025
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "back.out(1.5)",
        delay: 1.0,
      }
    );

    // Fade Up Hassan Farooqi
    gsap.fromTo(
      nameRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power4.out",
        delay: 1.2,
      }
    );

    // Subtitle reveal
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 1.4,
      }
    );

    // Buttons reveal
    gsap.fromTo(
      buttonsRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 1.6,
      }
    );
  }, []);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden py-24 select-none bg-[#050505]"
    >
      {/* Background Interactive Canvas Particle Starfield */}
      <canvas
        ref={particleCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Noise Texture layer */}
      <div className="noise-overlay" />

      {/* Center glowing ambient light leaks */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] glow-purple opacity-20 pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] glow-cyan opacity-15 pointer-events-none z-0"></div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        {/* YEAR BADGE */}
        <div
          ref={badgeRef}
          className="mb-8 flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-full bg-white/[0.02] backdrop-blur-md opacity-0 transform-gpu"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></span>
          <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-white/60">
            YEAR — 2025
          </span>
        </div>

        {/* GIANT "PORTFOLIO" GRAPHIC WITH GLASS OVERLAYS */}
        <div
          ref={titleContainerRef}
          className="relative w-full max-w-6xl flex justify-center items-center py-10 perspective-1000 mb-10 transform-gpu"
        >
          {/* Main Giant Portfolio Text */}
          <h1 className="font-serif italic text-[#F5F5DC] text-[13vw] sm:text-[11vw] md:text-[9.5vw] font-bold tracking-tight select-none leading-none scale-y-[1.05]">
            PORTFOLIO
          </h1>

          {/* Top Glass Overlay (swipes from left) */}
          <div
            ref={glassTopRef}
            className="absolute top-[5%] md:top-[12%] left-[-5%] sm:left-[5%] md:left-[10%] w-[55%] h-[35%] md:h-[32%] rounded-[50px] glass-overlay-blur overflow-hidden z-20 flex items-center border border-white/25 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] transform-gpu"
          >
            {/* Elegant lens refraction grid inside */}
            <div className="absolute inset-0 glass-grid-overlay opacity-30"></div>
            {/* Reflection shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none"></div>
          </div>

          {/* Bottom Glass Overlay (swipes from right) */}
          <div
            ref={glassBottomRef}
            className="absolute bottom-[5%] md:bottom-[15%] right-[-5%] sm:right-[5%] md:right-[15%] w-[50%] h-[35%] md:h-[30%] rounded-[50px] glass-overlay-blur overflow-hidden z-20 flex items-center border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.15)] transform-gpu"
          >
            {/* Elegant lens refraction grid inside */}
            <div className="absolute inset-0 glass-grid-overlay opacity-25"></div>
            {/* Reflection shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none"></div>
          </div>
        </div>

        {/* DEVELOPER NAME & TITLE */}
        <div className="flex flex-col items-center mt-4">
          <h2
            ref={nameRef}
            className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide opacity-0 transform-gpu"
          >
            Hassan Farooqi
          </h2>
          
          <p
            ref={subtitleRef}
            className="mt-4 text-white/50 text-xs md:text-sm font-mono tracking-[0.3em] uppercase flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 opacity-0 transform-gpu"
          >
            <span>Creative Developer</span>
            <span className="text-white/20">•</span>
            <span>UI/UX Designer</span>
            <span className="text-white/20">•</span>
            <span>AI Creator</span>
          </p>
        </div>

        {/* THREE PREMIUM INTERACTIVE BUTTONS */}
        <div
          ref={buttonsRef}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-lg opacity-0 transform-gpu"
        >
          {/* View Projects */}
          <button
            onClick={() => scrollToSection("projects")}
            onMouseDown={handleRipple}
            className="w-full sm:w-auto relative px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 text-xs tracking-widest font-mono text-white transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] active:scale-95 flex items-center justify-center gap-2 overflow-hidden cursor-pointer group"
          >
            <span>VIEW PROJECTS</span>
            <ArrowRight className="w-4.5 h-4.5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Contact Me */}
          <button
            onClick={() => scrollToSection("contact")}
            onMouseDown={handleRipple}
            className="w-full sm:w-auto relative px-8 py-3.5 rounded-full border border-white/15 bg-[#0d0d0d] hover:bg-[#151515] text-xs tracking-widest font-mono text-white transition-all duration-300 shadow-2xl hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] active:scale-95 flex items-center justify-center gap-2 overflow-hidden cursor-pointer group"
          >
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:scale-125 transition-transform"></span>
            <span>CONTACT ME</span>
            <ArrowUpRight className="w-4.5 h-4.5 text-purple-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Download Resume */}
          <a
            href="/resume.pdf"
            download="Hassan_Farooqi_Resume.pdf"
            className="w-full sm:w-auto relative px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.01] hover:bg-white/[0.08] text-xs tracking-widest font-mono text-white/70 hover:text-white transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 overflow-hidden cursor-pointer group"
          >
            <span>RESUME</span>
            <Download className="w-4 h-4 text-white/60 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* SCROLL DOWN INDICATOR */}
        <div 
          onClick={() => scrollToSection("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-[9px] tracking-[0.4em] font-mono uppercase">SCROLL DOWN</span>
          <div className="w-5 h-8 border border-white/25 rounded-full flex justify-center p-1 relative">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
          </div>
        </div>

      </div>
    </section>
  );
}
