import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ticker logic for luxury counting
    const obj = { val: 0 };
    const counterTimeline = gsap.timeline({
      onComplete: () => {
        // Stagger exit animation
        const exitTl = gsap.timeline({
          onComplete: onComplete,
        });

        exitTl.to(textRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power4.inOut",
        });

        exitTl.to(numberRef.current, {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: "power4.inOut",
          delay: -0.6
        });

        exitTl.to(containerRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
        });
      }
    });

    counterTimeline.to(obj, {
      val: 100,
      duration: 3.2,
      ease: "power3.inOut",
      onUpdate: () => {
        setPercent(Math.floor(obj.val));
      }
    });

    // Elegant text split stagger reveal
    if (textRef.current) {
      const letters = textRef.current.querySelectorAll(".char");
      gsap.fromTo(
        letters,
        { opacity: 0, y: 30, rotateX: -45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.05,
          duration: 1.5,
          ease: "power4.out",
          delay: 0.2
        }
      );
    }

    // Animate progress line indicator
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 3.2, ease: "power3.inOut" }
      );
    }
  }, [onComplete]);

  const name = "HASSAN FAROOQI";

  return (
    <div
      ref={containerRef}
      id="cinematic-loader"
      className="fixed inset-0 bg-[#050505] z-[99999] flex flex-col items-center justify-center select-none"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="w-full max-w-xl px-10 flex flex-col items-center relative">
        {/* Subtle glowing ambient behind */}
        <div className="absolute w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none -translate-y-12"></div>

        {/* Title Name Stagger */}
        <div
          ref={textRef}
          className="text-white text-3xl md:text-5xl font-sans tracking-[0.25em] font-light flex overflow-hidden py-4 perspective-1000"
        >
          {name.split("").map((char, index) => (
            <span
              key={index}
              className="char inline-block origin-bottom transform-gpu"
              style={{ display: char === " " ? "inline-block" : "inline-block", marginRight: char === " " ? "0.3em" : "0px" }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Dynamic Percentage Ticker */}
        <div ref={numberRef} className="mt-8 flex items-baseline gap-1 font-mono text-white/40 text-xs tracking-wider">
          <span className="text-white font-light text-2xl tracking-normal mr-1 tabular-nums">
            {String(percent).padStart(3, "0")}
          </span>
          <span>%</span>
        </div>

        {/* Ultra-minimal load bar */}
        <div className="w-48 h-[1px] bg-white/10 mt-6 relative overflow-hidden rounded-full">
          <div
            ref={barRef}
            className="absolute top-0 left-0 w-full h-full bg-white origin-left"
          ></div>
        </div>

        {/* Luxury subtitle */}
        <div className="mt-12 text-[10px] tracking-[0.4em] text-white/30 font-mono uppercase">
          EST. 2026 • DIGITAL ARCHITECT
        </div>
      </div>
    </div>
  );
}
