import { ArrowUp } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-[#0d0d0d] border-t border-white/5 py-12 md:py-16 select-none overflow-hidden">
      
      {/* Footer Ambient Background decoration */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] glow-purple opacity-5 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* BRAND COLUMN */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl tracking-wider text-white">HF</span>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-white/50">Hassan Farooqi</span>
          </div>
          <p className="text-[10px] text-white/30 font-mono tracking-wide text-center md:text-left">
            Crafting award-winning immersive developer interfaces.
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-xs tracking-wider text-white/40">
          {["about", "skills", "projects", "services", "drive", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => {
                const el = document.getElementById(section);
                if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
              }}
              className="hover:text-white uppercase transition-colors underline-hover cursor-pointer"
            >
              {section}
            </button>
          ))}
        </div>

        {/* COPYRIGHT AND BACK TO TOP BUTTON */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <button
            onClick={handleScrollToTop}
            className="group p-3 bg-white/[0.02] border border-white/5 hover:border-white/20 text-white rounded-full transition-all duration-300 hover:bg-white/[0.08] active:scale-90 flex items-center justify-center cursor-pointer shadow-lg"
            title="Back To Top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          
          <div className="text-[9px] font-mono tracking-widest text-white/20 uppercase text-center md:text-right">
            © {new Date().getFullYear()} HASSAN FAROOQI. ALL RIGHTS RESERVED.
          </div>
        </div>

      </div>
    </footer>
  );
}
