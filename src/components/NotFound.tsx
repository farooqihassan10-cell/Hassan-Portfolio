"use client";
import React, { useState, useEffect, useRef } from "react";

// Types
interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  zIndex: number;
}

export default function NotFoundPage() {
  const [stage, setStage] = useState<"BOOT" | "DESKTOP">("BOOT");
  const [bootStep, setBootStep] = useState(0);

  const [time, setTime] = useState("4:04 AM");
  const [randomGlitch, setRandomGlitch] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Background Horror & Glitch Textures
  const horrorBgImage = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200";
  const glitchBgImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000";

  // WINDOWS STATE
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    "CLICK ME": { id: "CLICK ME", title: "Limbo_Runner.exe", icon: "🎮", isOpen: false, isMinimized: false, x: 80, y: 40, zIndex: 1 },
    Fakeamp: { id: "Fakeamp", title: "FAKEAMP - [Dark Ambient]", icon: "⚡", isOpen: false, isMinimized: false, x: 120, y: 80, zIndex: 2 },
    Console: { id: "Console", title: "C:\\_ Terminal", icon: "💻", isOpen: false, isMinimized: false, x: 160, y: 120, zIndex: 3 },
    Image1: { id: "Image1", title: "C:\\Image_1.png", icon: "🖼️", isOpen: false, isMinimized: false, x: 200, y: 60, zIndex: 4 },
    Video: { id: "Video", title: "C:\\Video_Stream.mp4", icon: "📹", isOpen: false, isMinimized: false, x: 240, y: 140, zIndex: 5 },
    Note: { id: "Note", title: "Incident_Log.txt", icon: "📝", isOpen: false, isMinimized: false, x: 280, y: 180, zIndex: 6 },
    "Recovery.exe": { id: "Recovery.exe", title: "System_Restore.exe", icon: "🧬", isOpen: false, isMinimized: false, x: 320, y: 100, zIndex: 7 },
  });

  // Sound Synthesizer
  const playSound = (type: "beep" | "click" | "glitch" | "jump" | "slide" | "die") => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "beep") {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "click") {
        osc.type = "square";
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.02, now);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (type === "glitch") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(Math.random() * 800 + 100, now);
        gain.gain.setValueAtTime(0.1, now);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "jump") {
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "slide") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.08, now);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "die") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {}
  };

  // Boot Sequence
  useEffect(() => {
    if (stage !== "BOOT") return;
    const timer = setInterval(() => {
      setBootStep((prev) => {
        playSound("beep");
        if (prev >= 5) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(timer);
  }, [stage]);

  // Glitch Effect Loop
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);

    const eventTimer = setInterval(() => {
      if (stage === "DESKTOP") {
        const events = ["shake", "red-flash", "static-noise"];
        const chosen = events[Math.floor(Math.random() * events.length)];
        setRandomGlitch(chosen);
        playSound("glitch");
        setTimeout(() => setRandomGlitch(null), 800);
      }
    }, Math.random() * 15000 + 10000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(eventTimer);
    };
  }, [stage]);

  const openWindow = (id: string) => {
    playSound("click");
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: newZ },
    }));
  };

  const closeWindow = (id: string) => {
    playSound("click");
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const focusWindow = (id: string) => {
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: newZ },
    }));
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    focusWindow(id);
    const win = windows[id];
    const startX = e.clientX - win.x;
    const startY = e.clientY - win.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          x: Math.max(0, Math.min(window.innerWidth - 320, moveEvent.clientX - startX)),
          y: Math.max(0, Math.min(window.innerHeight - 200, moveEvent.clientY - startY)),
        },
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className={`min-h-screen bg-black text-white font-mono select-none overflow-hidden relative ${
        randomGlitch === "shake" ? "animate-pulse translate-x-1" : ""
      }`}
    >
      {/* Intense CRT Glitch Line & Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-50 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black pointer-events-none z-40" />

      {randomGlitch === "red-flash" && (
        <div className="absolute inset-0 bg-red-950/50 z-40 pointer-events-none animate-ping" />
      )}

      {/* ---------------- STAGE 1: BOOT SEQUENCE & INITIAL GLITCH SCREEN ---------------- */}
      {stage === "BOOT" ? (
        <div
          onClick={() => {
            playSound("glitch");
            setStage("DESKTOP");
          }}
          className="min-h-screen flex flex-col items-center justify-center cursor-pointer p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.85)), url('${glitchBgImage}')`,
          }}
        >
          {/* Top Boot Terminal Log */}
          <div className="max-w-lg w-full space-y-1.5 text-xs font-mono text-zinc-400 z-10 uppercase tracking-widest">
            {bootStep >= 0 && <p className="text-zinc-500">// VOID_OS_CORE_INIT_v3.0.9</p>}
            {bootStep >= 1 && <p className="text-red-500">[ERR] MEMORY CORRUPTED AT SECTOR 0x404</p>}
            {bootStep >= 2 && <p className="text-cyan-400">LOADING AUDIO_SYNTH_ENGINE... OK</p>}
            {bootStep >= 3 && <p className="text-yellow-400">CONNECTING TO DARK TERMINAL NODE...</p>}
            {bootStep >= 4 && <p className="text-green-500">GLITCH INTERFACE MOUNTED.</p>}
          </div>

          {/* Video-Matched Glitch Text Block */}
          {bootStep >= 5 && (
            <div className="mt-10 flex flex-col items-center text-center z-10">
              {/* Main 404 Glitch Banner */}
              <div className="relative mb-6 group">
                <div
                  className="bg-zinc-950 border-2 border-white text-white px-10 py-4 text-7xl md:text-9xl font-black tracking-widest relative z-10 uppercase bg-cover bg-center shadow-[8px_8px_0px_#ff0055,-8px_-8px_0px_#00f0ff]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${horrorBgImage}')`,
                  }}
                >
                  <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">404</span>
                </div>
              </div>

              {/* Video Style Glitch Strings */}
              <div className="font-mono text-xs md:text-sm text-cyan-400 tracking-[0.3em] font-extrabold mb-1 animate-pulse uppercase">
                123456789_CRITICAL_VOID
              </div>
              <div className="font-mono text-[10px] md:text-xs text-rose-500 tracking-[0.2em] mb-8 max-w-sm break-all opacity-90 font-bold uppercase">
                AWEUGUYIUHD07PKDmpkqmziontpasthasdtisa
              </div>

              {/* Click prompt matched to video vibes */}
              <div className="flex flex-col items-center space-y-1 text-cyan-300 font-mono text-xs md:text-sm tracking-widest uppercase">
                <p className="opacity-80">(( don't worry ))</p>
                <p className="text-white font-extrabold animate-bounce mt-2 bg-red-950/80 px-4 py-1 border border-red-500 shadow-[0_0_15px_#ff0055]">
                  (( JUST CLICK ON THE SCREEN ))
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ---------------- STAGE 2: RETRO OS DESKTOP ---------------- */
        <div className="min-h-screen flex flex-col justify-between bg-black relative overflow-hidden">
          {/* Horror Background Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 contrast-150 grayscale pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${horrorBgImage}')`,
            }}
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />

          {/* DESKTOP ICONS */}
          <div className="relative z-10 p-6 grid grid-cols-3 md:grid-cols-7 gap-6 max-w-4xl">
            {Object.values(windows).map((win) => (
              <div
                key={win.id}
                onClick={() => openWindow(win.id)}
                className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
              >
                <div className="w-12 h-12 border-2 border-white bg-zinc-950 flex items-center justify-center shadow-[3px_3px_0px_#fff] group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                  <span className="text-xl">{win.icon}</span>
                </div>
                <span className="text-[10px] md:text-xs text-white bg-black/80 px-1 text-center truncate max-w-[80px] font-mono group-hover:bg-white group-hover:text-black">
                  {win.id}
                </span>
              </div>
            ))}
          </div>

          {/* DESKTOP WINDOWS */}
          {Object.values(windows).map(
            (win) =>
              win.isOpen && (
                <div
                  key={win.id}
                  style={{
                    left: `${win.x}px`,
                    top: `${win.y}px`,
                    zIndex: win.zIndex,
                  }}
                  onClick={() => focusWindow(win.id)}
                  className="absolute bg-zinc-950 border-2 border-white w-full max-w-md md:max-w-xl shadow-[8px_8px_0px_rgba(255,255,255,0.9)] flex flex-col"
                >
                  {/* Title Bar */}
                  <div
                    onMouseDown={(e) => handleMouseDown(win.id, e)}
                    className="bg-white text-black px-3 py-1 flex justify-between items-center font-extrabold text-xs uppercase cursor-move select-none"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{win.icon}</span>
                      <span className="truncate">{win.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(win.id);
                      }}
                      className="bg-black text-white px-2 py-0.5 text-xs hover:bg-red-600 cursor-pointer"
                    >
                      X
                    </button>
                  </div>

                  {/* Window Content */}
                  <div className="p-4 overflow-y-auto max-h-[70vh] text-xs font-mono">
                    {win.id === "Fakeamp" && <FakeampPlayer playSound={playSound} />}
                    {win.id === "Console" && <ConsoleTerminal onRestore={() => openWindow("Recovery.exe")} />}

                    {win.id === "Image1" && (
                      <div className="text-center space-y-4">
                        <div className="border border-zinc-700 p-2 bg-black space-y-4">
                          <div className="text-[10px] text-zinc-500 mb-1">// ARCHIVE_ANGEL_RECORDS.RAW</div>
                          <div className="relative overflow-hidden group border border-zinc-800">
                            <img
                              src={horrorBgImage}
                              alt="Horror Angel Archive"
                              className="w-full grayscale contrast-200 opacity-80 group-hover:scale-105 transition-all duration-500"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 uppercase">Encrypted visual memory from Node 404.</p>
                      </div>
                    )}

                    {win.id === "Video" && (
                      <div className="text-center space-y-2">
                        <div className="aspect-video bg-zinc-900 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                          <span className="text-zinc-500 text-xs animate-pulse">[ SIGNAL TRANSMISSION CORRUPTED ]</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">Feed ID: CCTV_STATIC_CAM_09</p>
                      </div>
                    )}

                    {win.id === "Note" && (
                      <div className="bg-black p-3 border border-zinc-800 text-zinc-300 space-y-2 uppercase">
                        <p className="text-cyan-400 font-bold">// INCIDENT_LOG_2026.TXT</p>
                        <p>Subject entered restricted 404 void zone.</p>
                        <p>All navigation paths broken. Only Recovery.exe or Terminal commands can restore system state.</p>
                        <p className="text-rose-500 font-bold">WARNING: Do not execute Virus.exe!</p>
                      </div>
                    )}

                    {win.id === "Recovery.exe" && (
                      <div className="text-center space-y-4 py-4">
                        <p className="text-green-400 font-bold text-sm">SYSTEM RESTORE READY</p>
                        <p className="text-zinc-400 text-xs uppercase">Execute protocol to restore normal website routing?</p>
                        <button
                          onClick={() => {
                            playSound("glitch");
                            alert("SYSTEM RESTORED! Redirecting to Homepage...");
                            window.location.href = "/";
                          }}
                          className="px-6 py-2 bg-green-500 text-black font-extrabold hover:bg-green-400 cursor-pointer uppercase shadow-[0_0_15px_#22c55e]"
                        >
                          RESTORE & EXIT 404
                        </button>
                      </div>
                    )}

                    {win.id === "CLICK ME" && <LimboGameRunner playSound={playSound} />}
                  </div>
                </div>
              )
          )}

          {/* TASKBAR */}
          <div className="relative z-10 bg-zinc-300 border-t-2 border-white text-black px-3 py-1 flex justify-between items-center font-bold text-xs shadow-[0px_-2px_0px_#888]">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openWindow("Console")}
                className="flex items-center space-x-2 bg-zinc-200 border-2 border-zinc-500 border-r-black border-b-black px-3 py-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
                  <div className="bg-red-500" />
                  <div className="bg-green-500" />
                  <div className="bg-blue-500" />
                  <div className="bg-yellow-500" />
                </div>
                <span>START</span>
              </button>

              <div className="hidden md:flex space-x-1">
                {Object.values(windows).map(
                  (w) =>
                    w.isOpen && (
                      <button
                        key={w.id}
                        onClick={() => focusWindow(w.id)}
                        className="px-2 py-0.5 bg-zinc-200 border border-zinc-600 text-[10px] flex items-center space-x-1"
                      >
                        <span>{w.icon}</span>
                        <span>{w.id}</span>
                      </button>
                    )
                )}
              </div>
            </div>

            <div className="border-2 border-zinc-500 border-t-black border-l-black px-3 py-0.5 bg-zinc-200 text-zinc-800 flex items-center space-x-2">
              <span>🔊</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= FAKEAMP MUSIC PLAYER ================= */
function FakeampPlayer({ playSound }: { playSound: (t: any) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = [
    { title: "Track 1 (gfG9aJzFPd4)", duration: "3:45", url: "https://www.youtube.com/watch?v=gfG9aJzFPd4" },
    { title: "Track 2 (0ex9KKj7e88)", duration: "4:12", url: "https://www.youtube.com/watch?v=0ex9KKj7e88" },
    { title: "Track 3 (u9WsZoceais)", duration: "2:50", url: "https://www.youtube.com/watch?v=u9WsZoceais" },
    { title: "Track 4 (yYz9dpF-Z7w)", duration: "3:15", url: "https://www.youtube.com/watch?v=yYz9dpF-Z7w" },
  ];

  const togglePlay = () => {
    playSound("click");
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-zinc-900 border-2 border-zinc-600 p-2 text-white font-mono space-y-2 shadow-inner">
      <div className="bg-black border border-zinc-700 p-2 flex justify-between items-center text-green-400">
        <div className="flex items-center space-x-2">
          <span className="text-xs animate-pulse">{isPlaying ? "▶ PLAYING" : "❚❚ PAUSED"}</span>
          <span className="text-[10px] text-zinc-400 truncate max-w-[180px]">{playlist[trackIndex].title}</span>
        </div>
        <span className="text-xs font-bold">192 kbps</span>
      </div>

      <div className="bg-black h-12 border border-zinc-800 flex items-end justify-between px-2 py-1 gap-1">
        {[40, 70, 30, 90, 60, 100, 50, 80, 20, 90, 40, 80].map((h, i) => (
          <div
            key={i}
            style={{ height: isPlaying ? `${Math.random() * 100}%` : "15%" }}
            className="w-full bg-cyan-400 transition-all duration-100"
          />
        ))}
      </div>

      <div className="flex justify-between items-center bg-zinc-800 p-1 border border-zinc-700 text-xs">
        <div className="flex space-x-1">
          <button
            onClick={() => {
              playSound("click");
              setTrackIndex((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
            }}
            className="px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 border border-white/20"
          >
            ◄◄
          </button>
          <button onClick={togglePlay} className="px-2 py-0.5 bg-cyan-500 text-black font-bold border border-white/20">
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button
            onClick={() => {
              playSound("click");
              setTrackIndex((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
            }}
            className="px-2 py-0.5 bg-zinc-700 hover:bg-zinc-600 border border-white/20"
          >
            ►►
          </button>
        </div>
        <span className="text-[10px] text-zinc-400">{playlist[trackIndex].duration}</span>
      </div>

      <div className="bg-black border border-zinc-800 p-1 space-y-1 text-[10px]">
        {playlist.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              setTrackIndex(idx);
              setIsPlaying(true);
            }}
            className={`p-1 cursor-pointer flex justify-between items-center ${
              trackIndex === idx ? "bg-cyan-900 text-cyan-200 font-bold" : "text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            <span>{idx + 1}. {item.title}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-white ml-2 text-[9px]"
              onClick={(e) => e.stopPropagation()}
            >
              [Listen]
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= CONSOLE TERMINAL ================= */
function ConsoleTerminal({ onRestore }: { onRestore: () => void }) {
  const [history, setHistory] = useState<Array<{ cmd: string; res: string }>>([
    { cmd: "sys_init", res: "PROJECT VOID404 TERMINAL READY. Type 'help' for commands." },
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    let res = "";

    switch (cmd) {
      case "help":
        res = "COMMANDS: whoami | scan | recover | clear | void | home";
        break;
      case "whoami":
        res = "UNKNOWN_GUEST // ACCESS_LEVEL: DENIED";
        break;
      case "scan":
        res = "SCANNING... 1 CORRUPTED BLOCK FOUND AT NODE_404";
        break;
      case "recover":
      case "restore":
        res = "EXECUTING SYSTEM RESTORE PROTOCOL...";
        onRestore();
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "home":
        window.location.href = "/";
        res = "REDIRECTING...";
        break;
      default:
        res = `Command not recognized: '${cmd}'. Type 'help'.`;
    }

    setHistory((prev) => [...prev, { cmd: input, res }]);
    setInput("");
  };

  return (
    <div className="bg-black border border-green-500/30 p-3 text-green-400 font-mono text-xs h-64 flex flex-col justify-between">
      <div className="overflow-y-auto space-y-2 pr-1">
        {history.map((item, idx) => (
          <div key={idx}>
            <p className="text-zinc-500">&gt; {item.cmd}</p>
            <p className="text-green-400 whitespace-pre-wrap">{item.res}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="flex items-center space-x-2 border-t border-zinc-800 pt-2">
        <span className="text-green-500 font-bold">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none text-green-400 font-mono w-full text-xs"
          placeholder="type command..."
          autoFocus
        />
      </form>
    </div>
  );
}

/* ================= LIMBO GAME RUNNER ================= */
function LimboGameRunner({ playSound }: { playSound: (t: any) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [score, setScore] = useState(0);

  const keysRef = useRef({ left: false, right: false, jump: false, slide: false });
  const joystickRef = useRef({ active: false, startX: 0 });

  const handleJoystickStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    joystickRef.current = { active: true, startX: touch.clientX };
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickRef.current.active) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - joystickRef.current.startX;

    if (diffX < -15) {
      keysRef.current.left = true;
      keysRef.current.right = false;
    } else if (diffX > 15) {
      keysRef.current.right = true;
      keysRef.current.left = false;
    } else {
      keysRef.current.left = false;
      keysRef.current.right = false;
    }
  };

  const handleJoystickEnd = () => {
    joystickRef.current.active = false;
    keysRef.current.left = false;
    keysRef.current.right = false;
  };

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const gravity = 0.65;
    let gameSpeed = 5;
    let distanceScore = 0;

    const player = {
      x: 100,
      y: 260,
      width: 24,
      height: 48,
      normalHeight: 48,
      slideHeight: 22,
      vy: 0,
      isGrounded: false,
      isSliding: false,
    };

    let obstacles: Array<{ type: "PIT" | "WALL"; x: number; width: number; height: number }> = [];
    let spawnTimer = 0;

    const update = () => {
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#141619";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.quadraticCurveTo(400, 80, 800, 30);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = "900 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("404", 400, 160);

      if (keysRef.current.left && player.x > 20) player.x -= 4;
      if (keysRef.current.right && player.x < canvas.width - 60) player.x += 4;

      if (keysRef.current.slide && player.isGrounded) {
        if (!player.isSliding) playSound("slide");
        player.isSliding = true;
        player.height = player.slideHeight;
      } else {
        player.isSliding = false;
        player.height = player.normalHeight;
      }

      if (keysRef.current.jump && player.isGrounded && !player.isSliding) {
        player.vy = -12.5;
        player.isGrounded = false;
        playSound("jump");
      }

      player.vy += gravity;
      player.y += player.vy;

      const groundY = 310;
      let onPit = false;

      spawnTimer++;
      if (spawnTimer > 100) {
        spawnTimer = 0;
        const type = Math.random() > 0.45 ? "WALL" : "PIT";
        if (type === "WALL") {
          obstacles.push({ type: "WALL", x: canvas.width + 50, width: 40, height: 190 });
        } else {
          obstacles.push({ type: "PIT", x: canvas.width + 50, width: 90, height: 0 });
        }
      }

      ctx.fillStyle = "#000000";
      let currentX = 0;
      obstacles.forEach((obs) => {
        if (obs.type === "PIT") {
          ctx.fillRect(currentX, groundY, obs.x - currentX, canvas.height - groundY);
          currentX = obs.x + obs.width;
          if (player.x + player.width > obs.x && player.x < obs.x + obs.width) onPit = true;
        }
      });
      ctx.fillRect(currentX, groundY, canvas.width - currentX, canvas.height - groundY);

      if (!onPit) {
        if (player.y + player.height >= groundY) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.isGrounded = true;
        }
      } else {
        player.isGrounded = false;
      }

      obstacles.forEach((obs) => {
        obs.x -= gameSpeed;
        if (obs.type === "WALL") {
          ctx.fillStyle = "#000000";
          ctx.fillRect(obs.x, 0, obs.width, obs.height);

          if (player.x + player.width > obs.x && player.x < obs.x + obs.width && player.y < obs.height) {
            playSound("die");
            setGameState("GAMEOVER");
            return;
          }
        }
      });

      obstacles = obstacles.filter((o) => o.x + o.width > -50);

      if (player.y > canvas.height + 50) {
        playSound("die");
        setGameState("GAMEOVER");
        return;
      }

      ctx.fillStyle = "#000000";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(player.x + player.width - 8, player.y + (player.isSliding ? 6 : 10), 4, 4);

      distanceScore += 1;
      setScore(Math.floor(distanceScore / 10));

      animId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-[16/9] bg-black border border-zinc-800 rounded overflow-hidden">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />

        {gameState === "IDLE" && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-bold text-white mb-2 uppercase">LIMBO 404 RUNNER</h3>
            <button
              onClick={() => setGameState("PLAYING")}
              className="px-6 py-2 bg-white text-black font-extrabold text-xs uppercase cursor-pointer"
            >
              START
            </button>
          </div>
        )}

        {gameState === "GAMEOVER" && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-bold text-rose-500 mb-1 uppercase">CONSUMED BY SHADOWS</h3>
            <p className="text-xs text-zinc-400 mb-4">SCORE: {score}</p>
            <button
              onClick={() => setGameState("PLAYING")}
              className="px-6 py-2 bg-white text-black font-extrabold text-xs uppercase cursor-pointer"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      {gameState === "PLAYING" && (
        <div className="w-full mt-3 flex justify-between items-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded">
          <div
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
            className="w-20 h-20 bg-zinc-950 border border-cyan-500/40 rounded-full flex items-center justify-center relative touch-none"
          >
            <div className="w-6 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff]" />
          </div>

          <div className="flex gap-3">
            <button
              onTouchStart={() => (keysRef.current.slide = true)}
              onTouchEnd={() => (keysRef.current.slide = false)}
              className="w-12 h-12 bg-zinc-800 border border-white/40 text-white rounded-full font-bold text-xs"
            >
              SLIDE
            </button>
            <button
              onTouchStart={() => (keysRef.current.jump = true)}
              onTouchEnd={() => (keysRef.current.jump = false)}
              className="w-12 h-12 bg-white text-black rounded-full font-black text-xs"
            >
              JUMP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

