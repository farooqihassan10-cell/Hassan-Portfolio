"use client";
import React, { useState, useEffect, useRef } from "react";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "WON" | "LOST">("IDLE");
  const [score, setScore] = useState(0);

  // Retro Sci-Fi Audio Synthesizer (No external sound files required)
  const playSound = (freq: number, type: OscillatorType = "sine", duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context blocked until interaction
    }
  };

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const rows = 7;
    const cols = 12;
    const gridWidth = canvas.width;
    const gridHeight = canvas.height;
    const colWidth = gridWidth / cols;
    const rowHeight = gridHeight / rows;

    let player = { col: 0, row: 3 };

    const streams = Array.from({ length: cols - 2 }, (_, i) => {
      const colIndex = i + 1;
      return {
        col: colIndex,
        speed: (Math.random() * 1.5 + 1) * (i % 2 === 0 ? 1 : -1),
        blocks: [
          { y: Math.random() * gridHeight, height: 100 },
          { y: Math.random() * gridHeight, height: 80 },
        ],
      };
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        if (player.row > 0) player.row -= 1;
        playSound(440, "triangle");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        if (player.row < rows - 1) player.row += 1;
        playSound(440, "triangle");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (player.col > 0) player.col -= 1;
        playSound(350, "triangle");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (player.col < cols - 1) player.col += 1;
        playSound(520, "triangle");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const render = () => {
      ctx.fillStyle = "#04090e";
      ctx.fillRect(0, 0, gridWidth, gridHeight);

      // Cyber Grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * colWidth, 0);
        ctx.lineTo(c * colWidth, gridHeight);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * rowHeight);
        ctx.lineTo(gridWidth, r * rowHeight);
        ctx.stroke();
      }

      // Target Node
      const targetX = (cols - 1) * colWidth + colWidth / 2;
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      for (let r = 0; r < rows; r++) {
        const targetY = r * rowHeight + rowHeight / 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Obstacles (Firewall Streams)
      ctx.fillStyle = "#ff2a4b";
      ctx.shadowColor = "#ff2a4b";
      ctx.shadowBlur = 12;

      let hit = false;
      streams.forEach((stream) => {
        const x = stream.col * colWidth;
        stream.blocks.forEach((block) => {
          block.y += stream.speed;
          if (block.y > gridHeight) block.y = -block.height;
          if (block.y < -block.height) block.y = gridHeight;

          ctx.fillRect(x + 4, block.y, colWidth - 8, block.height);

          const playerY = player.row * rowHeight + rowHeight / 2;

          if (
            player.col === stream.col &&
            playerY >= block.y &&
            playerY <= block.y + block.height
          ) {
            hit = true;
          }
        });
      });

      ctx.shadowBlur = 0;

      // Player Node
      const px = player.col * colWidth + colWidth / 2;
      const py = player.row * rowHeight + rowHeight / 2;

      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (player.col === cols - 1) {
        playSound(880, "sine", 0.4);
        setScore((prev) => prev + 100);
        setGameState("WON");
        return;
      }

      if (hit) {
        playSound(150, "sawtooth", 0.3);
        setGameState("LOST");
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState("PLAYING");
    playSound(600, "sine");
  };

  return (
    <div className="min-h-screen bg-[#03070d] text-[#a0c0d0] font-mono relative overflow-hidden flex flex-col justify-between p-4 md:p-8 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black to-black pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 flex justify-between items-center border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-cyan-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 22h20L12 2zm0 3.8L18.5 20H5.5L12 5.8z" />
          </svg>
          <span className="text-xs uppercase tracking-widest text-cyan-500">System / Abstergo OS v4.04</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs text-red-500 tracking-wider">CONNECTION // OFFLINE</span>
        </div>
      </header>

      {/* MAIN SCREEN */}
      <main className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-cyan-500 to-cyan-950 tracking-tighter drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] text-cyan-200 mt-1 uppercase">
          Page Not Found
        </h2>
        <p className="text-xs md:text-sm text-cyan-600/80 mt-2 max-w-xl tracking-widest uppercase">
          [ The page you are looking for does not exist, but the system is still online ]
        </p>

        {/* GAME CONTAINER */}
        <div className="relative mt-6 p-1 border border-cyan-500/30 rounded-lg bg-black/60 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.1)] max-w-4xl w-full">
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

          <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-500/20 text-xs text-cyan-400">
            <span>MODULE: <strong className="text-white">BUILD MIND</strong></span>
            <span>SCORE: <strong className="text-cyan-300">{score}</strong></span>
          </div>

          <div className="relative w-full overflow-hidden flex items-center justify-center bg-[#04090e] aspect-[16/8]">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full object-contain"
            />

            {gameState === "IDLE" && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl md:text-3xl font-black text-cyan-300 tracking-wider mb-2">
                  BUILD MIND // HACK MINI-GAME
                </h3>
                <p className="text-xs md:text-sm text-cyan-500/80 max-w-md mb-6">
                  No Internet no issue. Play game, Build your mind and enjoy! Navigate your signal node across the firewall streams to reach the target node.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-cyan-500/10 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black transition-all duration-300 font-bold tracking-widest rounded uppercase shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  INITIALIZE GAME
                </button>
              </div>
            )}

            {gameState === "WON" && (
              <div className="absolute inset-0 bg-cyan-950/90 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-3xl font-bold text-cyan-300 tracking-widest mb-2">
                  ACCESS GRANTED!
                </h3>
                <p className="text-xs text-cyan-400 mb-6">Target Node Reached. Mind Capacity Built.</p>
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-cyan-400 text-black font-bold tracking-wider hover:bg-cyan-300 transition-all rounded uppercase cursor-pointer"
                >
                  NEXT LEVEL
                </button>
              </div>
            )}

            {gameState === "LOST" && (
              <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-3xl font-bold text-red-400 tracking-widest mb-2">
                  SIGNAL INTERCEPTED
                </h3>
                <p className="text-xs text-red-300/80 mb-6">Firewall block detected your connection.</p>
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-red-500 text-white font-bold tracking-wider hover:bg-red-400 transition-all rounded uppercase shadow-[0_0_20px_rgba(255,42,75,0.5)] cursor-pointer"
                >
                  RETRY SYSTEM
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-between items-center px-4 py-3 bg-cyan-950/20 text-[10px] md:text-xs text-cyan-500/80 border-t border-cyan-500/20">
            <div>// CONTROLS: <span className="text-cyan-300">[W, A, S, D]</span> or <span className="text-cyan-300">[ARROW KEYS]</span> TO MOVE</div>
            <div>// OBJECTIVE: REACH THE RIGHTMOST TARGET NODE</div>
          </div>
        </div>

        <p className="mt-4 text-xs tracking-[0.2em] text-cyan-600/70 uppercase">
          «« No Internet Connection Detected — Enjoy The Game While You're Offline »»
        </p>

        {/* NAVIGATION */}
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="/"
            className="px-6 py-2.5 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all rounded text-xs tracking-widest uppercase flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            GO HOME
          </a>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 flex justify-between items-center border-t border-cyan-500/10 pt-4 text-[10px] text-cyan-700">
        <div>STATUS: SYSTEM FUNCTIONAL</div>
        <div>IP TRACE: ---.---.---.---</div>
      </footer>
    </div>
  );
}
