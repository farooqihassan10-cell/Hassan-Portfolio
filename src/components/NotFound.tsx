"use client";
import React, { useState, useEffect, useRef } from "react";

export default function NotFoundPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [score, setScore] = useState(0);

  // Sound Synthesizer (Retro Minimal SFX)
  const playSFX = (type: "jump" | "slide" | "die") => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "jump") {
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "slide") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "die") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  // Input Controls Ref State
  const keysRef = useRef({ left: false, right: false, jump: false, slide: false });

  // Mobile Handlers
  const handleMobileInput = (action: "left" | "right" | "jump" | "slide", state: boolean) => {
    keysRef.current[action] = state;
  };

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Game Physics & Loop State
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
      vx: 0,
      vy: 0,
      isGrounded: false,
      isSliding: false,
    };

    // Obstacle Generator (Pits & Dark Walls with low holes)
    let obstacles: Array<{ type: "PIT" | "WALL"; x: number; width: number; height: number }> = [];
    let spawnTimer = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = true;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") keysRef.current.jump = true;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keysRef.current.slide = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = false;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") keysRef.current.jump = false;
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keysRef.current.slide = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // MAIN GAME LOOP
    const updateAndRender = () => {
      // 1. CLEAR & BACKGROUND (Limbo Atmosphere)
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant Fog Gradient
      const fogGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fogGrad.addColorStop(0, "#22252a");
      fogGrad.addColorStop(0.6, "#0e1014");
      fogGrad.addColorStop(1, "#050507");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Hanging Tree Branch & 404 Sign (Background Art)
      ctx.strokeStyle = "#141619";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.quadraticCurveTo(400, 80, 800, 30);
      ctx.stroke();

      // Hanging 404 Rope & Text
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#2c3038";
      ctx.beginPath();
      ctx.moveTo(360, 60); ctx.lineTo(360, 110);
      ctx.moveTo(400, 65); ctx.lineTo(400, 110);
      ctx.moveTo(440, 60); ctx.lineTo(440, 110);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = "900 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("404", 400, 160);

      // 2. PLAYER INPUT LOGIC
      if (keysRef.current.left && player.x > 20) player.x -= 4;
      if (keysRef.current.right && player.x < canvas.width - 60) player.x += 4;

      // Sliding / Crouching Logic
      if (keysRef.current.slide && player.isGrounded) {
        if (!player.isSliding) playSFX("slide");
        player.isSliding = true;
        player.height = player.slideHeight;
      } else {
        player.isSliding = false;
        player.height = player.normalHeight;
      }

      // Jumping Logic
      if (keysRef.current.jump && player.isGrounded && !player.isSliding) {
        player.vy = -12.5;
        player.isGrounded = false;
        playSFX("jump");
      }

      // Physics Gravity
      player.vy += gravity;
      player.y += player.vy;

      // Ground Collision Default
      const groundY = 310;
      let onPit = false;

      // 3. OBSTACLE GENERATION & LOOP
      spawnTimer++;
      if (spawnTimer > Math.max(70, 140 - Math.floor(distanceScore / 200))) {
        spawnTimer = 0;
        const type = Math.random() > 0.45 ? "WALL" : "PIT";
        if (type === "WALL") {
          obstacles.push({ type: "WALL", x: canvas.width + 50, width: 40, height: 190 });
        } else {
          obstacles.push({ type: "PIT", x: canvas.width + 50, width: 90, height: 0 });
        }
      }

      // Move & Draw Ground / Obstacles
      ctx.fillStyle = "#000000";

      // Base Ground Rendering
      let currentX = 0;
      obstacles.forEach((obs) => {
        if (obs.type === "PIT") {
          // Draw ground up to pit
          ctx.fillRect(currentX, groundY, obs.x - currentX, canvas.height - groundY);
          currentX = obs.x + obs.width;

          // Check if player is standing over pit
          if (player.x + player.width > obs.x && player.x < obs.x + obs.width) {
            onPit = true;
          }
        }
      });
      // Remaining ground
      ctx.fillRect(currentX, groundY, canvas.width - currentX, canvas.height - groundY);

      // Check Ground Landing
      if (!onPit) {
        if (player.y + player.height >= groundY) {
          player.y = groundY - player.height;
          player.vy = 0;
          player.isGrounded = true;
        }
      } else {
        player.isGrounded = false;
      }

      // Update & Render Obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;

        if (obs.type === "WALL") {
          // Dark Low Wall (Hole under darkness where player must slide)
          ctx.fillStyle = "#000000";
          ctx.fillRect(obs.x, 0, obs.width, obs.height); // Overhead dark wall

          // Darkness Fog Effect on wall bottom hole
          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.fillRect(obs.x - 10, obs.height, obs.width + 20, 40);

          // Collision Check with Overhead Wall
          if (
            player.x + player.width > obs.x &&
            player.x < obs.x + obs.width &&
            player.y < obs.height
          ) {
            playSFX("die");
            setGameState("GAMEOVER");
            return;
          }
        }
      });

      // Cleanup offscreen obstacles
      obstacles = obstacles.filter((obs) => obs.x + obs.width > -100);

      // Check Pit Fall Death
      if (player.y > canvas.height + 50) {
        playSFX("die");
        setGameState("GAMEOVER");
        return;
      }

      // 4. DRAW LIMBO SHADOW BOY CHARACTER
      ctx.fillStyle = "#000000";
      // Shadow Body Silhouette
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Glowing Eyes (Signature Limbo Style)
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;
      if (!player.isSliding) {
        ctx.fillRect(player.x + player.width - 8, player.y + 10, 4, 4);
      } else {
        ctx.fillRect(player.x + player.width - 8, player.y + 6, 4, 4);
      }
      ctx.shadowBlur = 0;

      // 5. SCORE & DIFFICULTY INCREMENT
      distanceScore += 1;
      gameSpeed = 5 + Math.floor(distanceScore / 400) * 0.5;
      setScore(Math.floor(distanceScore / 10));

      animationFrameId = requestAnimationFrame(updateAndRender);
    };

    updateAndRender();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState("PLAYING");
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#c0c5d0] font-mono select-none flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* HUD HEADER */}
      <header className="flex justify-between items-center border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs tracking-widest text-zinc-400">LIMBO // 404 RUNNER</span>
        </div>
        <div className="text-xs tracking-widest">
          SCORE: <strong className="text-white text-sm">{score}</strong>
        </div>
      </header>

      {/* GAME CANVAS AREA */}
      <main className="my-auto flex flex-col items-center justify-center">
        <div className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] aspect-[16/9]">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full object-contain"
          />

          {/* START SCREEN */}
          {gameState === "IDLE" && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                404 LOST
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 max-w-md mb-6 tracking-wide">
                Run through the dark silhouette world. Jump over pits and slide under dark hanging obstacles.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-white text-black font-extrabold tracking-widest hover:bg-zinc-200 transition-all rounded uppercase text-xs cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                ENTER DARKNESS
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-3xl font-black text-red-500 tracking-widest mb-1">
                CONSUMED BY SHADOWS
              </h2>
              <p className="text-xs text-zinc-400 mb-6">FINAL DISTANCE SCORE: {score}</p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-white text-black font-bold tracking-wider hover:bg-zinc-200 transition-all rounded uppercase text-xs cursor-pointer"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* CONTROLS HUD & ON-SCREEN TOUCH JOYSTICK / BUTTONS FOR MOBILE */}
        <div className="w-full max-w-4xl mt-3 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-950/60 p-3 rounded border border-white/5">
          <div className="text-[10px] md:text-xs text-zinc-500 text-center md:text-left">
            PC CONTROLS: <span className="text-white">[A / D] Move</span> | <span className="text-white">[W / SPACE] Jump</span> | <span className="text-white">[S] Slide</span>
          </div>

          {/* MOBILE TOUCH CONTROLS (JOYSTICK / D-PAD LAYOUT) */}
          <div className="flex justify-between items-center w-full md:w-auto gap-8 px-4">
            {/* LEFT SIDE: MOVEMENT (LEFT / RIGHT) */}
            <div className="flex gap-2">
              <button
                onTouchStart={() => handleMobileInput("left", true)}
                onTouchEnd={() => handleMobileInput("left", false)}
                onMouseDown={() => handleMobileInput("left", true)}
                onMouseUp={() => handleMobileInput("left", false)}
                className="w-12 h-12 bg-zinc-900 border border-white/20 text-white rounded-full flex items-center justify-center active:bg-white active:text-black font-bold text-lg select-none"
              >
                ◄
              </button>
              <button
                onTouchStart={() => handleMobileInput("right", true)}
                onTouchEnd={() => handleMobileInput("right", false)}
                onMouseDown={() => handleMobileInput("right", true)}
                onMouseUp={() => handleMobileInput("right", false)}
                className="w-12 h-12 bg-zinc-900 border border-white/20 text-white rounded-full flex items-center justify-center active:bg-white active:text-black font-bold text-lg select-none"
              >
                ►
              </button>
            </div>

            {/* RIGHT SIDE: ACTIONS (JUMP / SLIDE) */}
            <div className="flex gap-2">
              <button
                onTouchStart={() => handleMobileInput("slide", true)}
                onTouchEnd={() => handleMobileInput("slide", false)}
                onMouseDown={() => handleMobileInput("slide", true)}
                onMouseUp={() => handleMobileInput("slide", false)}
                className="w-12 h-12 bg-zinc-900 border border-white/20 text-white rounded-full flex items-center justify-center active:bg-white active:text-black font-bold text-xs select-none"
              >
                SLIDE
              </button>
              <button
                onTouchStart={() => handleMobileInput("jump", true)}
                onTouchEnd={() => handleMobileInput("jump", false)}
                onMouseDown={() => handleMobileInput("jump", true)}
                onMouseUp={() => handleMobileInput("jump", false)}
                className="w-12 h-12 bg-white text-black font-extrabold rounded-full flex items-center justify-center active:bg-zinc-400 text-xs select-none shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                JUMP
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px] text-zinc-600">
        <a href="/" className="text-zinc-400 hover:text-white transition-all uppercase tracking-widest">
          « Return to Main Site
        </a>
        <div>LIMBO ENGINE // ACTIVE</div>
      </footer>
    </div>
  );
}

