"use client";

import React, { useState, useEffect, useRef } from "react";

// Window interface for retro OS
interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  x: number;
  y: number;
  zIndex: number;
}

export default function NotFoundPage() {
  const [stage, setStage] = useState<"LANDING" | "DESKTOP">("LANDING");
  const [time, setTime] = useState("4:04 AM");
  const [maxZIndex, setMaxZIndex] = useState(10);

  // Audio Context for Retro Sound Effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Active Windows State (Exact to video timeline)
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    Video: { id: "Video", title: "C:\\Video", icon: "📹", isOpen: false, x: 20, y: 30, zIndex: 1 },
    "CLICK ME": { id: "CLICK ME", title: "C:\\Error", icon: "📁", isOpen: false, x: 40, y: 120, zIndex: 2 },
    Console: { id: "Console", title: "C:\\_ Terminal", icon: "💻", isOpen: false, x: 60, y: 60, zIndex: 3 },
    Image1: { id: "Image1", title: "C:\\Image_1", icon: "🖼️", isOpen: false, x: 80, y: 40, zIndex: 4 },
    Fakeamp: { id: "Fakeamp", title: "FAKEAMP", icon: "💿", isOpen: false, x: 30, y: 20, zIndex: 5 },
    Note: { id: "Note", title: "Incident_Log.txt", icon: "📝", isOpen: false, x: 100, y: 100, zIndex: 6 },
    Presave: { id: "Presave", title: "C:\\Presave", icon: "🌐", isOpen: false, x: 50, y: 80, zIndex: 7 },
  });

  // Sound Synthesizer Effect
  const playSound = (type: "click" | "glitch" | "beep") => {
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
      if (type === "click") {
        osc.type = "square";
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.03, now);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === "glitch") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(Math.random() * 600 + 100, now);
        gain.gain.setValueAtTime(0.08, now);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {}
  };

  // Clock Update
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(clockTimer);
  }, []);

  const openWindow = (id: string) => {
    playSound("click");
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, zIndex: newZ },
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
          x: Math.max(0, Math.min(window.innerWidth - 260, moveEvent.clientX - startX)),
          y: Math.max(0, Math.min(window.innerHeight - 150, moveEvent.clientY - startY)),
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
    <div className="min-h-screen bg-black text-white font-mono select-none overflow-hidden relative">
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-50 opacity-70" />

      {/* ---------------- STAGE 1: LANDING GLITCH SCREEN (00:00 - 00:07) ---------------- */}
      {stage === "LANDING" ? (
        <div
          onClick={() => {
            playSound("glitch");
            setStage("DESKTOP");
          }}
          className="min-h-screen flex flex-col items-center justify-center cursor-pointer p-4 relative bg-black"
        >
          {/* 404 Glitch Box with Chromatic Aberration */}
          <div className="relative mb-6">
            <div className="border-2 border-white bg-black px-8 py-3 text-6xl md:text-8xl font-black tracking-widest relative z-10 text-white shadow-[4px_0_0_#ff0055,-4px_0_0_#00e5ff] animate-pulse">
              404
            </div>
          </div>

          {/* Exact Text Layout from Video Frame 00:00 - 00:07 */}
          <div className="text-center font-mono space-y-2">
            <div className="text-cyan-400 text-xs md:text-sm tracking-widest">123456789</div>
            <div className="text-red-500 text-[10px] md:text-xs tracking-tight break-all max-w-xs md:max-w-md">
              AWEUGUYIUHD07PKDmpkqmziontpasthasdtisa
            </div>
            <div className="text-zinc-400 text-xs md:text-sm tracking-widest mt-4">((don't worry))</div>
            <div className="text-white text-xs md:text-sm tracking-widest font-bold animate-bounce mt-2">
              [just click on the screen]
            </div>
          </div>
        </div>
      ) : (
        /* ---------------- STAGE 2: DESKTOP OS (00:08 - 01:20) ---------------- */
        <div className="min-h-screen flex flex-col justify-between relative bg-[#0a0a0a] bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px]">
          {/* High-Contrast Glitch Static Background Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200')] bg-cover bg-center opacity-30 grayscale contrast-200 pointer-events-none" />

          {/* DESKTOP ICONS */}
          <div className="relative z-10 p-4 grid grid-cols-3 md:grid-cols-6 gap-6 max-w-2xl">
            {Object.values(windows).map(
              (win) =>
                win.id !== "Presave" && (
                  <div
                    key={win.id}
                    onClick={() => openWindow(win.id)}
                    className="flex flex-col items-center space-y-1 cursor-pointer group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-105">
                      {win.icon}
                    </div>
                    <span className="text-[11px] text-white bg-black/70 px-1 text-center truncate max-w-[80px]">
                      {win.id}
                    </span>
                  </div>
                )
            )}
          </div>

          {/* WINDOWS CONTAINER */}
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
                  className="absolute bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-zinc-800 border-r-zinc-800 shadow-2xl flex flex-col min-w-[260px] text-black"
                >
                  {/* Classic Windows Title Bar */}
                  <div
                    onMouseDown={(e) => handleMouseDown(win.id, e)}
                    className="bg-[#000080] text-white px-2 py-1 flex justify-between items-center font-bold text-xs select-none cursor-move"
                  >
                    <div className="flex items-center space-x-1.5 truncate">
                      <span>{win.icon}</span>
                      <span className="truncate">{win.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(win.id);
                      }}
                      className="bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-black border-r-black px-1.5 py-0.5 text-[10px] font-bold active:border-none cursor-pointer"
                    >
                      X
                    </button>
                  </div>

                  {/* Window Content Layouts */}
                  <div className="p-2 text-xs font-mono">
                    {/* VIDEO WINDOW */}
                    {win.id === "Video" && (
                      <div className="w-full bg-black aspect-video flex items-center justify-center border border-zinc-700">
                        <span className="text-zinc-500 text-[10px] animate-pulse">
                          [ VIDEO_STREAM_PLAYING ]
                        </span>
                      </div>
                    )}

                    {/* POPUP ERROR DIALOG (STAY STRANGE - 00:41) */}
                    {win.id === "CLICK ME" && (
                      <div className="text-center py-4 space-y-4 px-6">
                        <p className="text-black font-semibold text-sm">Stay Strange</p>
                        <button
                          onClick={() => closeWindow("CLICK ME")}
                          className="px-6 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black text-xs font-bold cursor-pointer active:border-none"
                        >
                          OK
                        </button>
                      </div>
                    )}

                    {/* IMAGE WINDOW (ANGEL STATUE - 00:29) */}
                    {win.id === "Image1" && (
                      <div className="bg-black p-1 border border-zinc-700 text-center">
                        <img
                          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600"
                          alt="Angel Statue"
                          className="w-full h-auto grayscale contrast-200"
                        />
                      </div>
                    )}

                    {/* FAKEAMP WINAMP PLAYER (00:52 - 01:12) */}
                    {win.id === "Fakeamp" && (
                      <FakeampPlayer
                        playSound={playSound}
                        openPresave={() => openWindow("Presave")}
                      />
                    )}

                    {/* PRESAVE STREAMING LINKS (01:13) */}
                    {win.id === "Presave" && <PresaveWindow />}

                    {/* CONSOLE TERMINAL */}
                    {win.id === "Console" && (
                      <div className="bg-black text-green-400 p-2 text-[11px] h-36 font-mono border border-zinc-800">
                        <p>&gt; VOID_OS_CORE_READY</p>
                        <p>&gt; TYPE 'HELP' FOR COMMANDS</p>
                      </div>
                    )}

                    {/* NOTE FILE */}
                    {win.id === "Note" && (
                      <div className="bg-white p-2 text-black text-[11px] h-32 border border-zinc-400">
                        Incident Log 2026:
                        <br />
                        - System corrupted at 0x404
                        <br />- Stay strange.
                      </div>
                    )}
                  </div>
                </div>
              )
          )}

          {/* TASKBAR (Bottom fixed) */}
          <div className="relative z-10 bg-[#c0c0c0] border-t-2 border-white px-2 py-1 flex justify-between items-center text-black font-bold text-xs shadow-inner">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openWindow("Console")}
                className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black px-2 py-0.5 flex items-center space-x-1 active:border-none cursor-pointer"
              >
                <div className="w-2.5 h-2.5 bg-black" />
                <span>Start</span>
              </button>

              <div className="hidden md:flex space-x-1">
                {Object.values(windows).map(
                  (w) =>
                    w.isOpen && (
                      <button
                        key={w.id}
                        onClick={() => focusWindow(w.id)}
                        className="px-2 py-0.5 bg-[#c0c0c0] border border-t-white border-l-white border-b-black border-r-black text-[10px] flex items-center space-x-1"
                      >
                        <span>{w.icon}</span>
                        <span>{w.id}</span>
                      </button>
                    )
                )}
              </div>
            </div>

            <div className="border border-b-white border-r-white border-t-zinc-800 border-l-zinc-800 px-2 py-0.5 bg-[#c0c0c0] text-[11px]">
              {time}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= FAKEAMP WINAMP COMPONENT (00:52) ================= */
function FakeampPlayer({
  playSound,
  openPresave,
}: {
  playSound: (t: any) => void;
  openPresave: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = [
    { title: "akiaura, LONOWN, Baby Jane - Deathwish", duration: "4:48" },
    { title: "akiaura, LONOWN - Black in White", duration: "0:32" },
    { title: "akiaura, LONOWN - Recrush", duration: "0:31" },
    { title: "akiaura, LONOWN, DJ Pointless - Firstclass Misery", duration: "0:36" },
  ];

  return (
    <div className="bg-zinc-950 text-white p-2 border border-zinc-700 font-mono text-[10px] space-y-2 w-64 md:w-80">
      {/* Track Display */}
      <div className="bg-black border border-zinc-800 p-1.5 flex justify-between items-center text-green-400">
        <span className="truncate max-w-[180px]">{playlist[trackIndex].title}</span>
        <span>{playlist[trackIndex].duration}</span>
      </div>

      {/* Winamp Equalizer Visualizer */}
      <div className="bg-black h-10 border border-zinc-800 flex items-end justify-between px-1 gap-0.5">
        {[40, 80, 20, 90, 60, 100, 50, 70, 30, 85, 45, 95].map((h, i) => (
          <div
            key={i}
            style={{ height: isPlaying ? `${Math.random() * 90 + 10}%` : "10%" }}
            className="w-full bg-green-500 transition-all duration-75"
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center bg-zinc-900 p-1 border border-zinc-800">
        <div className="flex space-x-1">
          <button
            onClick={() => {
              playSound("click");
              setIsPlaying(!isPlaying);
            }}
            className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-[10px]"
          >
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button
            onClick={() => {
              playSound("click");
              openPresave();
            }}
            className="px-2 py-0.5 bg-green-700 text-black font-bold text-[10px]"
          >
            PRE-SAVE
          </button>
        </div>
        <span className="text-zinc-400">192 kbps</span>
      </div>

      {/* Tracklist */}
      <div className="bg-black border border-zinc-800 p-1 space-y-1 max-h-24 overflow-y-auto">
        {playlist.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              playSound("click");
              setTrackIndex(idx);
            }}
            className={`p-0.5 cursor-pointer flex justify-between ${
              trackIndex === idx ? "bg-zinc-800 text-green-400 font-bold" : "text-zinc-500"
            }`}
          >
            <span className="truncate">{idx + 1}. {item.title}</span>
            <span>{item.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= PRESAVE WINDOW COMPONENT (01:13) ================= */
function PresaveWindow() {
  const streamingServices = [
    { name: "Spotify", url: "https://open.spotify.com", color: "bg-green-600" },
    { name: "Apple Music", url: "https://music.apple.com", color: "bg-red-600" },
    { name: "Yandex Music", url: "https://music.yandex.com", color: "bg-yellow-600" },
    { name: "VK Music", url: "https://vk.com/audio", color: "bg-blue-600" },
  ];

  return (
    <div className="bg-white p-3 space-y-2 text-black text-center w-56">
      <p className="text-xs font-bold mb-2">4 object(s)</p>
      <div className="grid grid-cols-2 gap-2">
        {streamingServices.map((service, idx) => (
          <a
            key={idx}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${service.color} text-white p-2 rounded text-[11px] font-bold block hover:opacity-90`}
          >
            {service.name}
          </a>
        ))}
      </div>
    </div>
  );
}

