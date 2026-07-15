import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS, Testimonial } from "../data";
import gsap from "gsap";

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto slide effect
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  // Sync scroll position with activeIndex
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cards = slider.querySelectorAll(".testimonial-card-wrapper");
    if (cards[activeIndex]) {
      const card = cards[activeIndex] as HTMLDivElement;
      gsap.to(slider, {
        scrollLeft: card.offsetLeft - slider.clientWidth / 2 + card.clientWidth / 2,
        duration: 0.8,
        ease: "power3.out"
      });
    }
  }, [activeIndex]);

  // Section Entrance Animation
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

            const cards = sliderRef.current?.querySelectorAll(".testimonial-card-wrapper");
            if (cards) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 30, scale: 0.98 },
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

  const handleArrowClick = (direction: "left" | "right") => {
    stopAutoPlay();
    if (direction === "left") {
      setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    } else {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }
    startAutoPlay();
  };

  return (
    <section
      ref={containerRef}
      className="relative py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] glow-white opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">
        
        {/* Header Block */}
        <div ref={headingRef} className="flex items-end justify-between mb-16 opacity-0 transform-gpu">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
              REVIEWS
            </span>
            <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
              What Clients Say
            </h3>
          </div>

          {/* Slider controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleArrowClick("left")}
              className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 text-white rounded-full transition-all duration-300 hover:bg-white/[0.08] active:scale-90 cursor-pointer"
              title="Previous Client"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleArrowClick("right")}
              className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 text-white rounded-full transition-all duration-300 hover:bg-white/[0.08] active:scale-90 cursor-pointer"
              title="Next Client"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar py-6 select-none relative"
          style={{ scrollSnapType: "x mandatory", scrollBehavior: "auto" }}
        >
          {TESTIMONIALS.map((test, index) => {
            const isSelected = activeIndex === index;
            return (
              <div
                key={test.id}
                className="testimonial-card-wrapper flex-shrink-0 w-full md:w-[600px] scroll-snap-align-center transition-all duration-500 opacity-0 transform-gpu"
                style={{ scrollSnapAlign: "center" }}
              >
                <div 
                  className={`glass-card p-8 md:p-12 rounded-[32px] border flex flex-col justify-between h-[360px] md:h-[320px] relative transition-all duration-500 ${
                    isSelected 
                      ? "border-white/15 bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.4)]" 
                      : "border-white/5 bg-white/[0.02] scale-95 opacity-40"
                  }`}
                >
                  {/* Glowing quote icon accent */}
                  <div className="absolute top-8 right-8 p-3 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center justify-center text-white/10">
                    <Quote className="w-6 h-6" />
                  </div>

                  <div>
                    {/* Stars Rating Row */}
                    <div className="flex items-center gap-1 mb-6">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]" />
                      ))}
                    </div>

                    {/* Testimonial Message */}
                    <p className="text-white/80 text-sm md:text-base leading-relaxed tracking-wide italic font-light font-sans line-clamp-4">
                      "{test.review}"
                    </p>
                  </div>

                  {/* Client Info Grid */}
                  <div className="flex items-center gap-4 mt-8 border-t border-white/5 pt-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/15 shadow-md">
                      <img
                        src={test.image}
                        alt={test.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm text-white font-medium tracking-wide">
                        {test.name}
                      </h4>
                      <p className="text-[10px] font-mono uppercase text-white/40 tracking-widest mt-0.5">
                        {test.company} • {test.role}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bullet Indicator Ticker */}
        <div className="flex justify-center gap-2.5 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoPlay();
                setActiveIndex(index);
                startAutoPlay();
              }}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                activeIndex === index ? "w-8 bg-white" : "w-1.5 bg-white/20"
              }`}
              title={`Go to testimonial ${index + 1}`}
            ></button>
          ))}
        </div>

      </div>
    </section>
  );
}
