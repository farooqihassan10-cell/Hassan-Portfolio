import React, { useEffect, useRef, useState } from "react";
import { Code2, Layers, Cpu, Box, Sparkles, Image, PenTool } from "lucide-react";
import { SKILLS, Skill } from "../data";
import gsap from "gsap";

// Map skill icon string to Lucide component
const iconMap: Record<string, React.ComponentType<any>> = {
  html5: Code2,
  css3: Layers,
  js: Cpu,
  blender: Box,
  canvas: Sparkles,
  photoshop: Image,
  illustrator: PenTool,
};

function SkillCard({ skill }: { skill: Skill }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const IconComponent = iconMap[skill.icon] || Code2;

  // 3D Card Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle calculations (max 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate subtle glow shift
    const glow = card.querySelector(".hover-glow-layer") as HTMLDivElement;
    if (glow) {
      gsap.to(glow, {
        background: `radial-gradient(circle 120px at ${x}px ${y}px, rgba(255,255,255,0.06), transparent)`,
        duration: 0.1
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    const glow = card.querySelector(".hover-glow-layer") as HTMLDivElement;
    if (glow) {
      gsap.to(glow, {
        background: `radial-gradient(circle at center, transparent, transparent)`,
        duration: 0.5
      });
    }
  };

  // Animate progress bar on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          if (progressRef.current) {
            gsap.fromTo(
              progressRef.current,
              { scaleX: 0 },
              { scaleX: skill.percentage / 100, duration: 2.0, ease: "power4.out" }
            );
          }
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [skill.percentage, hasAnimated]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative glass-card p-6 rounded-2xl flex flex-col justify-between aspect-video md:aspect-auto md:h-40 overflow-hidden transform-gpu select-none border border-white/5 cursor-pointer shadow-lg"
    >
      {/* Dynamic Hover Glow Layer */}
      <div className="hover-glow-layer absolute inset-0 pointer-events-none z-0"></div>

      {/* Brand accents */}
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-white/10"></div>
      <div className="absolute top-0 right-0 w-[1px] h-8 bg-white/10"></div>

      {/* Icon and Percent Heading */}
      <div className="flex items-center justify-between relative z-10">
        <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-white/80 group-hover:text-white" />
        </div>
        <div className="font-mono text-sm text-white/40">{skill.percentage}%</div>
      </div>

      {/* Skill Name & Progress */}
      <div className="mt-6 relative z-10">
        <h4 className="font-sans text-white text-base tracking-wider font-light uppercase">
          {skill.name}
        </h4>
        
        {/* Sleek Custom glowing progress bar */}
        <div className="w-full h-[3px] bg-white/5 mt-3 rounded-full overflow-hidden relative">
          <div
            ref={progressRef}
            className={`absolute top-0 left-0 h-full w-full bg-gradient-to-r ${skill.color} origin-left rounded-full`}
            style={{ transform: "scaleX(0)" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
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

            const cards = containerRef.current?.querySelectorAll(".skill-card-anim");
            if (cards) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 1.2, ease: "power4.out" }
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
      id="skills"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] glow-purple opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div ref={headingRef} className="flex flex-col items-center text-center mb-16 opacity-0 transform-gpu">
          <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
            EXPERTISE
          </span>
          <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
            My Skills
          </h3>
          <div className="w-12 h-[1px] bg-white/10 mt-4"></div>
        </div>

        {/* Responsive Skill Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((skill, index) => (
            <div key={index} className="skill-card-anim opacity-0 transform-gpu">
              <SkillCard skill={skill} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
