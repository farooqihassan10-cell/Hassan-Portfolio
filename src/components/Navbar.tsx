import { useState, useEffect } from "react";
import { Home, User, Code2, Briefcase, Layers, Cloud, FileDown, Send, Menu, X } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav items with their respective icons
  const navItems = [
    { label: "Home", id: "home", icon: Home },
    { label: "About", id: "about", icon: User },
    { label: "Skills", id: "skills", icon: Code2 },
    { label: "Projects", id: "projects", icon: Briefcase },
    { label: "Services", id: "services", icon: Layers },
    { label: "Drive", id: "drive", icon: Cloud },
    { label: "Resume", id: "resume", icon: FileDown },
    { label: "Contact", id: "contact", icon: Send },
  ];

  // Track scroll section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const sections = navItems.map(item => document.getElementById(item.id));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    
    if (id === "resume") {
      // Trigger resume download directly
      window.open("/resume.pdf", "_blank");
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = element.offsetTop - 100;
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full select-none">
        {/* Futuristic Mechanical Navigation Structure */}
        <div className="w-full max-w-5xl flex items-center justify-between gap-4">
          
          {/* LEFT: Angular HF Brand Badge */}
          <div 
            onClick={() => handleNavClick("home")}
            className="group cursor-pointer flex items-center justify-center gap-3 bg-[#0d0d0d]/90 hover:bg-[#121212]/95 border-t border-l border-white/20 px-6 py-2.5 shadow-2xl relative transition-all duration-300 nav-badge-left border-b border-r border-white/5 active:scale-95"
          >
            {/* Glossy Reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30 pointer-events-none"></div>
            
            {/* Interactive Corner Crosshairs */}
            <span className="absolute top-1 left-1 text-[8px] text-white/30 font-mono">+</span>
            
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-xl tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                HF
              </span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/70 group-hover:text-white transition-colors hidden sm:inline-block">
                Hassan Farooqi
              </span>
            </div>
          </div>

          {/* RIGHT: Floating Mechanical Connected Navbar */}
          <nav className="hidden lg:flex items-center bg-[#0a0a0a]/80 backdrop-blur-[30px] border border-white/10 px-2 py-1.5 shadow-2xl rounded-full relative overflow-hidden">
            {/* Subtle glow layer */}
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>
            
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-500 cursor-pointer ${
                      isActive 
                        ? "text-white bg-white/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.05)]" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {/* Floating Icon Animation */}
                    <Icon className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 text-white/70 group-hover:text-white" />
                    
                    <span>{item.label}</span>
                    
                    {/* Hover Glow Pill */}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_10px_#fff]"></span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* MOBILE TOGGLE: Developer Menu Button */}
          <div className="lg:hidden flex">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[#0d0d0d]/90 hover:bg-[#121212] border border-white/20 p-2.5 shadow-2xl relative transition-all duration-300 nav-badge-right"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div 
        className={`fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-[30px] flex flex-col justify-center items-center transition-all duration-500 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Background design accents */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col items-center gap-6 w-full px-8">
          <span className="text-white/30 text-xs tracking-[0.4em] font-mono mb-4 uppercase">NAVIGATION PANEL</span>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 text-lg font-mono tracking-widest py-3 border-b border-white/5 w-full max-w-xs transition-colors ${
                  isActive ? "text-white border-white/20 font-medium" : "text-white/50"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5 text-white/50" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="mt-8 font-mono text-[9px] text-white/25 tracking-widest uppercase">
            HASSAN FAROOQI • PORTFOLIO 2026
          </div>
        </div>
      </div>
    </>
  );
}
