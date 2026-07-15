import { useEffect, useRef } from "react";
import { Monitor, Figma, Cpu, ArrowUpRight } from "lucide-react";
import gsap from "gsap";

const SERVICES = [
  {
    icon: Monitor,
    title: "Creative Development",
    description: "Engineering stunning full-stack experiences utilizing modern layout frameworks, pixel-perfect fluid motion, optimized physics canvases, and highly customized shaders.",
    badge: "FRONTEND / INTERACTIVE"
  },
  {
    icon: Figma,
    title: "UI/UX Architecture",
    description: "Designing modern, editorial digital interfaces with high-contrast color choices, Swiss typography pairing rules, custom iconography, and responsive visual hierarchies.",
    badge: "PRODUCT DESIGN"
  },
  {
    icon: Cpu,
    title: "AI Ecosystems",
    description: "Integrating smart neural nodes directly into applications, custom prompt chaining, automated multimodal content generation pipelines, and high-performance proxy routing.",
    badge: "AI INTEGRATION"
  }
];

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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

            const cards = containerRef.current?.querySelectorAll(".service-card-wrapper");
            if (cards) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 1.2, ease: "power4.out" }
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

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[450px] h-[450px] glow-white opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div ref={headingRef} className="flex flex-col items-center text-center mb-16 opacity-0 transform-gpu">
          <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
            CAPABILITIES
          </span>
          <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
            Services
          </h3>
          <div className="w-12 h-[1px] bg-white/10 mt-4"></div>
        </div>

        {/* Bento/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index} 
                className="service-card-wrapper glass-card p-8 rounded-3xl flex flex-col justify-between group h-96 relative overflow-hidden opacity-0 transform-gpu cursor-pointer"
              >
                {/* Micro glowing indicator on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <div>
                  {/* Floating Action Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                      {service.badge}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  {/* Icon Block */}
                  <div className="mt-8 p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                    <IconComponent className="w-6 h-6 text-white/80 group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Typography info */}
                <div>
                  <h4 className="font-sans text-lg tracking-wider font-light uppercase text-white mb-3">
                    {service.title}
                  </h4>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed tracking-wide">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
