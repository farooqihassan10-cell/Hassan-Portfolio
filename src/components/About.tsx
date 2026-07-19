import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import profileImage from "../assets/images/profile.png";

// Image path we generated: /src/assets/images/hassan_farooqi_profile_1784050081837.jpg
const PROFILE_IMAGE_PATH = profileImage;

interface CounterProps {
  end: number;
  suffix: string;
  label: string;
}

function Counter({ end, suffix, label }: CounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          const obj = { val: 0 };
          gsap.to(obj, {
            val: end,
            duration: 2.2,
            ease: "power3.out",
            onUpdate: () => {
              setCount(Math.floor(obj.val));
            }
          });
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={elementRef} className="flex flex-col items-center justify-center p-6 border-r last:border-0 border-white/5 text-center flex-1 min-w-[120px] md:min-w-0">
      <div className="font-sans text-2xl md:text-4xl text-white font-semibold tracking-tight tabular-nums flex items-baseline">
        <span>{count}</span>
        <span className="text-white/60 font-light text-xl ml-0.5">{suffix}</span>
      </div>
      <div className="mt-2 text-[10px] tracking-[0.2em] font-mono uppercase text-white/40">
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in reveal on scroll using IntersectionObserver and GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              headingRef.current,
              { opacity: 0, y: 30, filter: "blur(8px)" },
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" }
            );
            gsap.fromTo(
              textRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.15 }
            );
            gsap.fromTo(
              imageFrameRef.current,
              { opacity: 0, scale: 0.95, filter: "blur(4px)" },
              { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power4.out", delay: 0.2 }
            );
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-white opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Large Glass Panel Layout */}
        <div className="glass-panel p-8 md:p-14 rounded-[40px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative overflow-hidden">
          
          {/* Subtle line decorations on glass card */}
          <div className="absolute top-0 left-0 w-20 h-[1px] bg-white/20"></div>
          <div className="absolute top-0 left-0 w-[1px] h-20 bg-white/20"></div>
          <div className="absolute bottom-0 right-0 w-20 h-[1px] bg-white/20"></div>
          <div className="absolute bottom-0 right-0 w-[1px] h-20 bg-white/20"></div>

          {/* LEFT: Premium Profile Image in Glass Frame */}
          <div 
            ref={imageFrameRef}
            className="w-full max-w-[340px] md:max-w-[400px] lg:w-2/5 aspect-square flex-shrink-0 relative group transform-gpu"
          >
            {/* Outer high-end glass shadow frame */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-white/5 via-transparent to-white/10 rounded-[34px] border border-white/5 opacity-80 pointer-events-none"></div>
            
            <div className="w-full h-full p-3 rounded-[30px] border border-white/10 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-[20px] overflow-hidden relative">
                {/* Profile Image */}
                <img
                  src={PROFILE_IMAGE_PATH}
                  alt="Hassan Farooqi Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                />

                {/* Bottom dark blend overlay to merge portrait into background seamlessly */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                {/* High-end glossy sweeping shine across portrait */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700"></div>
              </div>
            </div>

            {/* Custom interactive coordinate tag */}
            <div className="absolute -bottom-4 right-6 font-mono text-[9px] text-white/40 bg-[#0d0d0d] px-3 py-1 border border-white/10 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>DEV_COORD // 40.7128° N</span>
            </div>
          </div>

          {/* RIGHT: Editorial Content and Counters */}
          <div className="w-full lg:w-3/5 flex flex-col justify-center">
            <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
              ABOUT ME
            </span>
            
            <h3
              ref={headingRef}
              className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide leading-tight mb-6 opacity-0 transform-gpu"
            >
              Building digital experiences that leave impact.
            </h3>

            <div
              ref={textRef}
              className="text-white/60 text-sm md:text-base leading-relaxed tracking-wide space-y-4 mb-10 opacity-0 transform-gpu"
            >
              <p>
                I'm Hassan, a passionate Creative Developer and Designer who loves crafting beautiful, functional, and user-centered digital experiences. I combine creativity with code to build products that not only look amazing but also perform exceptionally.
              </p>
              <p>
                By bridging the gap between design and high-performance engineering, I build highly interactive products incorporating smooth motion design, layout theory, and modular coding architectures.
              </p>
            </div>

            {/* FOUR AUTOMATED SCROLL COUNTERS */}
            <div className="flex flex-wrap md:flex-nowrap items-center bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              <Counter end={50} suffix="+" label="Projects Completed" />
              <Counter end={30} suffix="+" label="Happy Clients" />
              <Counter end={3} suffix="+" label="Years of Experience" />
              <Counter end={10} suffix="+" label="Awards Received" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
