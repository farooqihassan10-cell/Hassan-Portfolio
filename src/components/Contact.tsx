import React, { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, Send, CheckCircle } from "lucide-react";
import gsap from "gsap";

const GLASS_SPHERE_PATH = "/src/assets/images/glass_sphere_3d_1784050099857.jpg";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Floating sphere animation
  useEffect(() => {
    if (sphereRef.current) {
      gsap.to(sphereRef.current, {
        y: -15,
        rotation: 3,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }
  }, []);

  // Scroll Entrance Reveal Animation
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
            gsap.fromTo(
              leftColRef.current,
              { opacity: 0, x: -40 },
              { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.15 }
            );
            gsap.fromTo(
              rightColRef.current,
              { opacity: 0, x: 40 },
              { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.15 }
            );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    
    // Simulate luxury API response lag
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      
      // Auto-clear success message
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1800);
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="relative min-h-screen w-full flex flex-col justify-center py-24 select-none bg-[#050505] overflow-hidden"
    >
      {/* Background glow elements */}
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] glow-purple opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] glow-cyan opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        
        {/* Section Heading */}
        <div ref={headingRef} className="flex flex-col items-center text-center mb-16 opacity-0 transform-gpu">
          <span className="font-mono text-[10px] text-purple-400 tracking-[0.4em] uppercase mb-3">
            GET IN TOUCH
          </span>
          <h3 className="font-serif italic text-white text-3xl md:text-5xl font-light tracking-wide">
            Contact
          </h3>
          <div className="w-12 h-[1px] bg-white/10 mt-4"></div>
        </div>

        {/* Form Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start relative">
          
          {/* LEFT COLUMN: Coordinates and Info */}
          <div ref={leftColRef} className="flex flex-col opacity-0 transform-gpu">
            <span className="font-mono text-[11px] text-white/30 tracking-[0.3em] uppercase mb-6">
              COORDINATES // DIRECT_LINE
            </span>
            
            <h4 className="font-serif italic text-white text-2xl md:text-4xl font-light tracking-wide leading-tight mb-8">
              Let's craft something <br />
              unforgettable together.
            </h4>

            {/* Core Info Rows */}
            <div className="flex flex-col gap-6 mb-12">
              
              {/* Email */}
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">EMAIL</div>
                  <a href="mailto:farooqihassan10@gmail.com" className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors">
                    farooqihassan10@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">PHONE</div>
                  <a href="tel:+923115988798" className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors">
                    +92 311 5988798
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                  <MapPin className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">LOCATION</div>
                  <span className="text-sm md:text-base text-white/80">
                    Islamabad, Pakistan
                  </span>
                </div>
              </div>

            </div>

            {/* Social Icons Strip */}
            <div>
              <span className="text-[10px] font-mono tracking-widest text-white/20 uppercase block mb-4">SOCIAL SYNDICATE</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, link: "https://github.com/farooqihassan10-cell" },
                  { icon: Linkedin, link: "https://www.linkedin.com/in/sayed-muhammad-hassan-farooqi-86b08a311?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
                  { icon: Instagram, link: "https://instagram.com" },
                  { icon: Facebook, link: "https://www.facebook.com/share/1BcJ29knH6/" }
                ].map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.08] text-white/60 hover:text-white rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form with Floating 3D Sphere */}
          <div ref={rightColRef} className="opacity-0 transform-gpu relative">
            
            {/* FLOATING 3D GLASS SPHERE (Animate hover bouncing) */}
            <div 
              ref={sphereRef} 
              className="absolute -top-16 -right-12 sm:-right-24 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden pointer-events-none z-10 opacity-70 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            >
              <img
                src={GLASS_SPHERE_PATH}
                alt="3D Glass Sphere"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glass Contact Form Box */}
            <div className="glass-panel p-8 sm:p-10 rounded-[32px] border border-white/10 relative overflow-hidden shadow-2xl">
              
              {/* Form success state overlay */}
              {submitSuccess && (
                <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20">
                  <CheckCircle className="w-14 h-14 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="font-serif italic text-white text-xl md:text-2xl font-light tracking-wide mb-2">
                    Message Dispatched Successfully
                  </h4>
                  <p className="text-white/50 text-xs sm:text-sm tracking-wide leading-relaxed max-w-sm">
                    Thank you, Hassan has received your request and will establish contact inside 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Name / Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-white/20 font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-white/20 font-sans"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Project Collaboration"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-white/20 font-sans"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[9px] tracking-widest text-white/30 uppercase">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your creative venture..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-white/[0.02] border border-white/5 focus:border-white/30 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none transition-all placeholder:text-white/20 font-sans resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-xs tracking-widest font-mono text-white text-center flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer group shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
