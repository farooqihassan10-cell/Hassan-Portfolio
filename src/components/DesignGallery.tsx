// Coverflow Gallery — Enhanced Advance 3D UI & Robust Image Safe Guards
"use client"
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
} from "react";

// Image Imports
import poster1 from "../assets/images/poster1.png";
import poster2 from "../assets/images/poster2.png";
import poster3 from "../assets/images/poster3.png";
import poster4 from "../assets/images/poster4.png";
import poster5 from "../assets/images/poster5.png";
import poster6 from "../assets/images/poster6.png";
import poster7 from "../assets/images/poster7.png";
import poster8 from "../assets/images/poster8.png";
import poster9 from "../assets/images/poster9.png";

const useIsStaticRenderer = () => typeof window === "undefined";

interface Slide {
  image?: { src?: any; alt?: string };
  title?: string;
}

type AutoplayDir = "leftToRight" | "rightToLeft";
type TitleCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

interface Smooth3DSlideshowProps {
  slides?: Slide[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  tilt?: number;
  sideTilt?: number;
  gap?: number;
  opacity?: number;
  transition?: any;
  autoplay?: boolean;
  autoplayDirection?: AutoplayDir;
  showTitle?: boolean;
  titleFont?: CSSProperties;
  titleColor?: string;
  titlePosition?: {
    position?: TitleCorner;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
  };
  style?: CSSProperties;
}

const DEFAULT_SLIDES: Slide[] = [
  { image: { src: poster1 }, title: "Poster 1" },
  { image: { src: poster2 }, title: "Poster 2" },
  { image: { src: poster3 }, title: "Poster 3" },
  { image: { src: poster4 }, title: "Poster 4" },
  { image: { src: poster5 }, title: "Poster 5" },
  { image: { src: poster6 }, title: "Poster 6" },
  { image: { src: poster7 }, title: "Poster 7" },
  { image: { src: poster8 }, title: "Poster 8" },
  { image: { src: poster9 }, title: "Poster 9" },
];

const PERSPECTIVE = 1400;
const SCALE_STEP = 0.15;
const MAX_VISIBLE = 3;
const DEPTH = 200;

function cssTransition(t: any): { dur: number; ease: string } {
  const dur = t && typeof t.duration === "number" ? t.duration : 0.6;
  let ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  const e = t?.ease;
  if (Array.isArray(e) && e.length === 4) {
    ease = `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
  }
  return { dur, ease };
}

// Helper to extract proper Image URL string from Next.js dynamic objects
const getImageSrc = (imgSource: any): string => {
  if (!imgSource) return "";
  if (typeof imgSource === "string") return imgSource;
  if (typeof imgSource === "object" && imgSource.src) return imgSource.src;
  return "";
};

export default function DesignGallery(props: Smooth3DSlideshowProps) {
  props = { ...COMPONENT_DEFAULTS, ...props };
  const {
    slides = DEFAULT_SLIDES,
    cardWidth = 420,
    cardHeight = 580,
    radius = 6,
    tilt = 15,
    sideTilt = 6,
    gap = 9,
    opacity = 60,
    transition,
    autoplay = false,
    autoplayDirection = "rightToLeft",
    showTitle = true,
    titleFont,
    titleColor = "#ffffff",
    titlePosition,
    style,
  } = props;

  const tp = titlePosition || {};
  const corner: TitleCorner = tp.position || "bottomLeft";
  const isTop = corner === "topLeft" || corner === "topRight";
  const isRight = corner === "topRight" || corner === "bottomRight";
  const padLeft = tp.paddingLeft ?? 22;
  const padRight = tp.paddingRight ?? 22;
  const padTop = tp.paddingTop ?? 24;
  const padBottom = tp.paddingBottom ?? 24;

  const isStatic = useIsStaticRenderer();
  const list = slides && slides.length ? slides : DEFAULT_SLIDES;
  const n = list.length;
  const loop = true;

  const [active, setActive] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  const moveDur = transition?.duration ?? 0.6;
  const lockRef = useRef(false);

  const lock = useCallback(() => {
    lockRef.current = true;
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        lockRef.current = false;
      }, Math.max(50, moveDur * 1000));
    } else {
      lockRef.current = false;
    }
  }, [moveDur]);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock]
  );

  const handleCardClick = useCallback(
    (i: number) => {
      if (isStatic || lockRef.current) return;
      if (Math.abs(dragDistance.current) > 10) return;
      lock();
      setActive(i);
    },
    [isStatic, lock]
  );

  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    dragDistance.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    dragDistance.current = clientX - startX.current;
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragDistance.current > 40) {
      step(-1);
    } else if (dragDistance.current < -40) {
      step(1);
    }
  };

  const delay = transition?.delay ?? 2.5;
  useEffect(() => {
    if (isStatic || !autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [isStatic, autoplay, autoplayDirection, delay, n, step]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const { dur, ease } = cssTransition(transition);
  const transitionCss = `all ${dur}s ${ease}`;
  const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * 16;
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const rootStyle: CSSProperties = {
    ...(style || {}),
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 620,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    cursor: "grab",
  };

  return (
    <section className="py-20 bg-[#050508] relative overflow-hidden select-none my-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
          Creative Design Gallery
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Explore our interactive 3D showcase. Drag or click to inspect artwork.
        </p>
      </div>

      <div
        style={rootStyle}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        onKeyDown={isStatic ? undefined : onKeyDown}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {list.map((slide, i) => {
            let rel = i - active;
            if (loop) {
              if (rel > n / 2) rel -= n;
              if (rel < -n / 2) rel += n;
            }
            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const sc = Math.max(0.35, 1 - ax * SCALE_STEP);
            const tx = rel * (gap * 28);
            const tz = -ax * DEPTH;
            const ry = -rel * tilt;
            const rz = rel * sideTilt;
            const src = getImageSrc(slide.image?.src);
            const isBroken = imageErrors[i];

            const cardStyle: CSSProperties = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: cardHeight,
              borderRadius: `${effectiveRadius}px`,
              overflow: "hidden",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
              transition: transitionCss,
              opacity: visible ? 1 : 0,
              cursor: isActive ? "default" : "pointer",
              pointerEvents: visible && !isStatic ? "auto" : "none",
              backgroundColor: "#0d0d12",
              boxShadow: isActive
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.1)"
                : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
              border: isActive
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(255, 255, 255, 0.05)",
            };

            return (
              <div
                key={i}
                style={cardStyle}
                onClick={isStatic ? undefined : () => handleCardClick(i)}
                aria-label={slide.title}
                aria-hidden={!visible}
              >
                {src && !isBroken ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
                    <img
                      src={src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110 pointer-events-none"
                    />
                    <img
                      src={src}
                      alt={slide.image?.alt || slide.title || ""}
                      onError={() => handleImageError(i)}
                      draggable={false}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        position: "relative",
                        zIndex: 2,
                        userSelect: "none",
                        filter: isActive ? "brightness(1)" : "brightness(0.7)",
                        transition: "filter 0.5s ease",
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#161622] to-[#0a0a0f] text-gray-400 p-6 text-center">
                    <span className="text-sm font-semibold tracking-wider text-purple-400">
                      DESIGN PREVIEW
                    </span>
                    <span className="text-xl font-bold mt-2 text-white">
                      {slide.title}
                    </span>
                  </div>
                )}

                {showTitle && slide.title && (
                  <div className="z-10 absolute inset-0 pointer-events-none">
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: isTop
                          ? "linear-gradient(0deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)"
                          : "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: padLeft,
                        right: padRight,
                        [isTop ? "top" : "bottom"]: isTop ? padTop : padBottom,
                        textAlign: isRight ? "right" : "left",
                      }}
                    >
                      <span
                        style={{
                          color: titleColor,
                          fontSize: "30px",
                          fontWeight: 700,
                          lineHeight: "1.2em",
                          letterSpacing: "0.02em",
                          whiteSpace: "pre-line",
                          textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                          fontFamily: "'Vaporize', 'Inter', sans-serif",
                          ...(titleFont || {}),
                        }}
                      >
                        {slide.title}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 3,
                    background: "#000000",
                    opacity: isActive ? 0 : dim,
                    transition: `opacity ${dur}s ${ease}`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const COMPONENT_DEFAULTS: Smooth3DSlideshowProps = {
  slides: DEFAULT_SLIDES,
  cardWidth: 420,
  cardHeight: 580,
  radius: 6,
  tilt: 15,
  sideTilt: 6,
  gap: 9,
  opacity: 60,
  autoplay: false,
  autoplayDirection: "rightToLeft",
  transition: {
    type: "tween",
    duration: 0.6,
    delay: 2.5,
    ease: [0.16, 1, 0.3, 1],
  },
  showTitle: true,
  titleFont: {
    fontFamily: "'Vaporize', sans-serif",
    fontWeight: 700,
    fontSize: "30px",
  } as CSSProperties,
  titleColor: "#ffffff",
  titlePosition: {
    position: "bottomLeft",
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
};
  const isStatic = useIsStaticRenderer();
  const list = slides && slides.length ? slides : DEFAULT_SLIDES;
  const n = list.length;
  const loop = true;

  const [active, setActive] = useState(0);

  // Drag / Touch state variables
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  useEffect(() => {
    setActive((a) => Math.max(0, Math.min(n - 1, a)));
  }, [n]);

  const moveDur = transition?.duration ?? 0.6;
  const lockRef = useRef(false);

  const lock = useCallback(() => {
    lockRef.current = true;
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        lockRef.current = false;
      }, Math.max(50, moveDur * 1000));
    } else {
      lockRef.current = false;
    }
  }, [moveDur]);

  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lock();
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n, lock]
  );

  const handleCardClick = useCallback(
    (i: number) => {
      if (isStatic || lockRef.current) return;
      if (Math.abs(dragDistance.current) > 10) return; // Ignore drag clicks
      lock();
      setActive(i);
    },
    [isStatic, lock]
  );

  // Drag and Swipe Handlers
  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    dragDistance.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    dragDistance.current = clientX - startX.current;
  };

  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (dragDistance.current > 40) {
      step(-1); // Move Left
    } else if (dragDistance.current < -40) {
      step(1); // Move Right
    }
  };

  // Autoplay
  const delay = transition?.delay ?? 2.5;
  useEffect(() => {
    if (isStatic || !autoplay || n < 2) return;
    const ms = Math.max(0.3, delay) * 1000;
    const dir = autoplayDirection === "leftToRight" ? -1 : 1;
    const id = window.setInterval(() => step(dir), ms);
    return () => window.clearInterval(id);
  }, [isStatic, autoplay, autoplayDirection, delay, n, step]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    },
    [step]
  );

  const { dur, ease } = cssTransition(transition);
  const transitionCss = `all ${dur}s ${ease}`;
  const effectiveRadius = (Math.max(0, Math.min(20, radius)) / 20) * 16;
  const dim = 1 - Math.max(0, Math.min(100, opacity)) / 100;

  const rootStyle: CSSProperties = {
    ...(style || {}),
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 620,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: `${PERSPECTIVE}px`,
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    cursor: "grab",
  };

  return (
    <section className="py-20 bg-[#050508] relative overflow-hidden select-none">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center mb-12 relative z-10 px-4">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
          Creative Design Gallery
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Explore our interactive 3D showcase. Drag or click to inspect artwork.
        </p>
      </div>

      <div
        style={rootStyle}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        onKeyDown={isStatic ? undefined : onKeyDown}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          style={{
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            transformStyle: "preserve-3d",
          }}
        >
          {list.map((slide, i) => {
            let rel = i - active;
            if (loop) {
              if (rel > n / 2) rel -= n;
              if (rel < -n / 2) rel += n;
            }
            const ax = Math.abs(rel);
            const visible = ax <= MAX_VISIBLE;
            const isActive = rel === 0;
            const sc = Math.max(0.35, 1 - ax * SCALE_STEP);
            const tx = rel * (gap * 28);
            const tz = -ax * DEPTH;
            const ry = -rel * tilt;
            const rz = rel * sideTilt;
            const src = (slide.image?.src as any) || "";

            const cardStyle: CSSProperties = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: cardHeight,
              borderRadius: `${effectiveRadius}px`,
              overflow: "hidden",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
              transition: transitionCss,
              opacity: visible ? 1 : 0,
              cursor: isActive ? "default" : "pointer",
              pointerEvents: visible && !isStatic ? "auto" : "none",
              backgroundColor: "#0d0d12",
              boxShadow: isActive
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.1)"
                : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
              border: isActive
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "1px solid rgba(255, 255, 255, 0.05)",
            };

            return (
              <div
                key={i}
                style={cardStyle}
                onClick={isStatic ? undefined : () => handleCardClick(i)}
                aria-label={slide.title}
                aria-hidden={!visible}
              >
                {src ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
                    {/* Blurred Image Background Fill to prevent empty spaces */}
                    <img
                      src={src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xl scale-110 pointer-events-none"
                    />

                    {/* Actual Main Image with Complete Display */}
                    <img
                      src={src}
                      alt={slide.image?.alt || slide.title || ""}
                      draggable={false}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        position: "relative",
                        zIndex: 2,
                        userSelect: "none",
                        filter: isActive ? "brightness(1)" : "brightness(0.7)",
                        transition: "filter 0.5s ease",
                      }}
                    />
                  </div>
                ) : null}

                {showTitle && slide.title && (
                  <div className="z-10 absolute inset-0 pointer-events-none">
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: isTop
                          ? "linear-gradient(0deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)"
                          : "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: padLeft,
                        right: padRight,
                        [isTop ? "top" : "bottom"]: isTop ? padTop : padBottom,
                        textAlign: isRight ? "right" : "left",
                      }}
                    >
                      <span
                        style={{
                          color: titleColor,
                          fontSize: "30px",
                          fontWeight: 700,
                          lineHeight: "1.2em",
                          letterSpacing: "0.02em",
                          whiteSpace: "pre-line",
                          textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                          fontFamily: "'Vaporize', 'Inter', sans-serif",
                          ...(titleFont || {}),
                        }}
                      >
                        {slide.title}
                      </span>
                    </div>
                  </div>
                )}

                {/* Dark Dimming Layer for Inactive Cards */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 3,
                    background: "#000000",
                    opacity: isActive ? 0 : dim,
                    transition: `opacity ${dur}s ${ease}`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const COMPONENT_DEFAULTS: Smooth3DSlideshowProps = {
  slides: DEFAULT_SLIDES,
  cardWidth: 420,
  cardHeight: 580,
  radius: 6,
  tilt: 15,
  sideTilt: 6,
  gap: 9,
  opacity: 60,
  autoplay: false,
  autoplayDirection: "rightToLeft",
  transition: {
    type: "tween",
    duration: 0.6,
    delay: 2.5,
    ease: [0.16, 1, 0.3, 1],
  },
  showTitle: true,
  titleFont: {
    fontFamily: "'Vaporize', sans-serif",
    fontWeight: 700,
    fontSize: "30px",
  } as CSSProperties,
  titleColor: "#ffffff",
  titlePosition: {
    position: "bottomLeft",
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 24,
    paddingBottom: 24,
  },
};

