"use client";
import React, { useState, useEffect, useRef } from "react";

export default function NotFoundPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [time, setTime] = useState("4:04 AM");

  // Custom Links/Paths Configuration (Aap yahan apne Links dal sakte hain)
  const [customAssets, setCustomAssets] = useState({
    videoUrl: "", // e.g. "https://www.youtube.com/embed/your_video_id" ya local video path
    imageUrl: "", // e.g. "/images/my-image.jpg" ya direct URL
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [score, setScore] = useState(0);

  // Input Controls Ref State
  const keysRef = useRef({ left: false, right: false, jump: false, slide: false });

  // Joystick state for Mobile Touch
  const joystickRef = useRef({ active: false, startX: 0, currentX: 0 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Audio Synthesizer
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

  // Joystick Touch Events (Left Side)
  const handleJoystickStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    joystickRef.current = { active: true, startX: touch.clientX, currentX: touch.clientX };
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!joystickRef.current.active) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - joystickRef.current.startX;
    joystickRef.current.currentX = touch.clientX;

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

  // GAME LOOP EFFECT
  useEffect(() => {
    if (gameState !== "PLAYING" || activeWindow !== "CLICK ME") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

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

    const updateAndRender = () => {
      // Background & Atmosphere
      ctx.fillStyle = "#0a0a0c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fogGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fogGrad.addColorStop(0, "#22252a");
      fogGrad.addColorStop(0.6, "#0e1014");
      fogGrad.addColorStop(1, "#050507");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Branch & Hanging 404
      ctx.strokeStyle = "#141619";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.quadraticCurveTo(400, 80, 800, 30);
      ctx.stroke();

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

      // Movement Input
      if (keysRef.current.left && player.x > 20) player.x -= 4;
      if (keysRef.current.right && player.x < canvas.width - 60) player.x += 4;

      // Slide & Jump Logic
      if (keysRef.current.slide && player.isGrounded) {
        if (!player.isSliding) playSFX("slide");
        player.isSliding = true;
        player.height = player.slideHeight;
      } else {
        player.isSliding = false;
        player.height = player.normalHeight;
      }

      if (keysRef.current.jump && player.isGrounded && !player.isSliding) {
        player.vy = -12.5;
        player.isGrounded = false;
        playSFX("jump");
      }

      player.vy += gravity;
      player.y += player.vy;

      const groundY = 310;
      let onPit = false;

      // Obstacle Generation
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

      ctx.fillStyle = "#000000";
      let currentX = 0;
      obstacles.forEach((obs) => {
        if (obs.type === "PIT") {
          ctx.fillRect(currentX, groundY, obs.x - currentX, canvas.height - groundY);
          currentX = obs.x + obs.width;
          if (player.x + player.width > obs.x && player.x < obs.x + obs.width) {
            onPit = true;
          }
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
          ctx.fillStyle = "rgba(0,0,0,0.85)";
          ctx.fillRect(obs.x - 10, obs.height, obs.width + 20, 40);

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

      obstacles = obstacles.filter((obs) => obs.x + obs.width > -100);

      if (player.y > canvas.height + 50) {
        playSFX("die");
        setGameState("GAMEOVER");
        return;
      }

      // Draw Shadow Boy
      ctx.fillStyle = "#000000";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;
      if (!player.isSliding) {
        ctx.fillRect(player.x + player.width - 8, player.y + 10, 4, 4);
      } else {
        ctx.fillRect(player.x + player.width - 8, player.y + 6, 4, 4);
      }
      ctx.shadowBlur = 0;

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
  }, [gameState, activeWindow]);

  return (
    <div className="min-h-screen bg-black text-white font-mono select-none overflow-hidden relative">
      {/* ---------------- STAGE 1: GLITCH LOCKSCREEN ---------------- */}
      {!isUnlocked ? (
        <div
          onClick={() => setIsUnlocked(true)}
          className="min-h-screen flex flex-col items-center justify-center cursor-pointer p-4 relative overflow-hidden bg-[#030303]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

          <div className="relative mb-6">
            <div className="bg-white text-black px-6 py-2 text-5xl md:text-7xl font-black tracking-widest relative z-10 shadow-[4px_4px_0px_#ff0055,-4px_-4px_0px_#00f0ff]">
              404
            </div>
          </div>

          <div className="text-xs md:text-sm text-cyan-400 tracking-widest mb-2 animate-pulse">
            1123456789
          </div>
          <div className="text-[10px] md:text-xs text-rose-500 tracking-widest mb-8 text-center max-w-xs break-all opacity-80">
            AWEUGUYIUHD07PKDmpkqmziontpasthasdtisa
          </div>

          <div className="flex flex-col items-center space-y-1 text-cyan-300 text-xs md:text-sm tracking-wider">
            <p className="opacity-90">((don't worry))</p>
            <p className="text-white font-bold animate-bounce mt-2">
              ((just click on the screen))
            </p>
          </div>
        </div>
      ) : (
        /* ---------------- STAGE 2: RETRO DESKTOP OS ---------------- */
        <div className="min-h-screen flex flex-col justify-between bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black opacity-90" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          {/* DESKTOP ICONS */}
          <div className="relative z-10 p-6 grid grid-cols-3 md:grid-cols-6 gap-6 max-w-2xl">
            {/* Video Icon */}
            <div
              onClick={() => setActiveWindow("Video")}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#fff]">
                <span className="text-xl">📹</span>
              </div>
              <span className="text-xs text-white bg-black/70 px-1 group-hover:bg-white group-hover:text-black">
                Video
              </span>
            </div>

            {/* Game Icon (CLICK ME) */}
            <div
              onClick={() => {
                setActiveWindow("CLICK ME");
                setGameState("IDLE");
              }}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#00f0ff] animate-pulse">
                <span className="text-xl">🎮</span>
              </div>
              <span className="text-xs text-cyan-300 font-bold bg-black/70 px-1 group-hover:bg-cyan-300 group-hover:text-black">
                CLICK ME
              </span>
            </div>

            {/* Console Icon */}
            <div
              onClick={() => setActiveWindow("Console")}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#fff]">
                <span className="text-xs font-bold text-green-400">C:\_</span>
              </div>
              <span className="text-xs text-white bg-black/70 px-1 group-hover:bg-white group-hover:text-black">
                Console
              </span>
            </div>

            {/* Image1 Icon */}
            <div
              onClick={() => setActiveWindow("Image1")}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#fff]">
                <span className="text-xl">🖼️</span>
              </div>
              <span className="text-xs text-white bg-black/70 px-1 group-hover:bg-white group-hover:text-black">
                Image1
              </span>
            </div>

            {/* Fakeamp Icon */}
            <div
              onClick={() => setActiveWindow("Fakeamp")}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#ff0055]">
                <span className="text-xl">⚡</span>
              </div>
              <span className="text-xs text-white bg-black/70 px-1 group-hover:bg-white group-hover:text-black">
                Fakeamp
              </span>
            </div>

            {/* Note Icon */}
            <div
              onClick={() => setActiveWindow("Note")}
              className="flex flex-col items-center space-y-2 p-2 rounded hover:bg-white/10 cursor-pointer group"
            >
              <div className="w-12 h-12 border-2 border-white bg-zinc-900 flex items-center justify-center shadow-[3px_3px_0px_#fff]">
                <span className="text-xl">📝</span>
              </div>
              <span className="text-xs text-white bg-black/70 px-1 group-hover:bg-white group-hover:text-black">
                Note
              </span>
            </div>
          </div>

          {/* ACTIVE WINDOW POP-UP */}
          {activeWindow && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-zinc-950 border-2 border-white w-full max-w-4xl shadow-[8px_8px_0px_#00f0ff] flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-white text-black px-3 py-1 flex justify-between items-center font-bold text-xs uppercase">
                  <span>{activeWindow}.exe</span>
                  <button
                    onClick={() => {
                      setActiveWindow(null);
                      setGameState("IDLE");
                    }}
                    className="bg-black text-white px-2 py-0.5 text-xs hover:bg-red-600 cursor-pointer"
                  >
                    X
                  </button>
                </div>

                {/* Window Body */}
                <div className="p-3 md:p-4 overflow-y-auto flex flex-col items-center justify-center">
                  {/* VIDEO WINDOW */}
                  {activeWindow === "Video" && (
                    <div className="w-full text-center">
                      <p className="text-xs text-zinc-400 mb-2">// MEDIA PLAYER</p>
                      {customAssets.videoUrl ? (
                        <iframe
                          src={customAssets.videoUrl}
                          className="w-full aspect-video border border-zinc-700"
                          title="Custom Video"
                        />
                      ) : (
                        <div className="p-8 border border-dashed border-zinc-700 text-xs text-zinc-500">
                          [ VIDEO LINK NOT ADDED YET ]
                          <br />
                          Code me <code className="text-cyan-400">customAssets.videoUrl</code> me link add karein.
                        </div>
                      )}
                    </div>
                  )}

                  {/* IMAGE WINDOW */}
                  {activeWindow === "Image1" && (
                    <div className="w-full text-center">
                      <p className="text-xs text-zinc-400 mb-2">// IMAGE VIEWER</p>
                      {customAssets.imageUrl ? (
                        <img
                          src={customAssets.imageUrl}
                          alt="Custom"
                          className="max-h-80 mx-auto object-contain border border-zinc-700"
                        />
                      ) : (
                        <div className="p-8 border border-dashed border-zinc-700 text-xs text-zinc-500">
                          [ IMAGE PATH NOT ADDED YET ]
                          <br />
                          Code me <code className="text-cyan-400">customAssets.imageUrl</code> me path add karein.
                        </div>
                      )}
                    </div>
                  )}

                  {/* GAME WINDOW (CLICK ME) */}
                  {activeWindow === "CLICK ME" && (
                    <div className="w-full flex flex-col items-center">
                      <div className="relative w-full bg-[#0a0a0c] border border-white/10 rounded overflow-hidden aspect-[16/9]">
                        <canvas
                          ref={canvasRef}
                          width={800}
                          height={400}
                          className="w-full h-full object-contain"
                        />

                        {gameState === "IDLE" && (
                          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center">
                            <h2 className="text-3xl font-black text-white tracking-widest mb-2">
                              LIMBO 404 RUNNER
                            </h2>
                            <p className="text-xs text-zinc-400 max-w-sm mb-4">
                              Slide under dark walls & jump over pits!
                            </p>
                            <button
                              onClick={() => setGameState("PLAYING")}
                              className="px-6 py-2 bg-white text-black font-extrabold tracking-widest hover:bg-zinc-200 transition-all rounded uppercase text-xs cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            >
                              START GAME
                            </button>
                          </div>
                        )}

                        {gameState === "GAMEOVER" && (
                          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center">
                            <h3 className="text-2xl font-black text-red-500 tracking-widest mb-1">
                              GAME OVER
                            </h3>
                            <p className="text-xs text-zinc-400 mb-4">SCORE: {score}</p>
                            <button
                              onClick={() => setGameState("PLAYING")}
                              className="px-6 py-2 bg-white text-black font-bold tracking-wider hover:bg-zinc-200 transition-all rounded uppercase text-xs cursor-pointer"
                            >
                              RETRY
                            </button>
                          </div>
                        )}
                      </div>

                      {/* GAME CONTROLS: MOBILE TOUCH JOYSTICK (LEFT) + ACTION BUTTONS (RIGHT) */}
                      {gameState === "PLAYING" && (
                        <div className="w-full mt-3 flex justify-between items-center px-4 py-2 bg-zinc-900 border border-zinc-800 rounded">
                          {/* LEFT SIDE: ANALOG JOYSTICK UI FOR TOUCH */}
                          <div
                            onTouchStart={handleJoystickStart}
                            onTouchMove={handleJoystickMove}
                            onTouchEnd={handleJoystickEnd}
                            className="w-24 h-24 bg-zinc-950 border-2 border-cyan-500/40 rounded-full flex items-center justify-center relative touch-none shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                          >
                            <div className="w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff] pointer-events-none" />
                            <span className="absolute -bottom-4 text-[9px] text-cyan-500 font-bold">JOYSTICK</span>
                          </div>

                          {/* RIGHT SIDE: JUMP & SLIDE BUTTONS */}
                          <div className="flex gap-4">
                            <button
                              onTouchStart={() => (keysRef.current.slide = true)}
                              onTouchEnd={() => (keysRef.current.slide = false)}
                              onMouseDown={() => (keysRef.current.slide = true)}
                              onMouseUp={() => (keysRef.current.slide = false)}
                              className="w-14 h-14 bg-zinc-800 border-2 border-white/40 text-white rounded-full flex flex-col items-center justify-center active:bg-white active:text-black font-extrabold text-xs shadow-md select-none"
                            >
                              <span>▼</span>
                              <span className="text-[9px]">SLIDE</span>
                            </button>
                            <button
                              onTouchStart={() => (keysRef.current.jump = true)}
                              onTouchEnd={() => (keysRef.current.jump = false)}
                              onMouseDown={() => (keysRef.current.jump = true)}
                              onMouseUp={() => (keysRef.current.jump = false)}
                              className="w-14 h-14 bg-white text-black rounded-full flex flex-col items-center justify-center active:bg-zinc-300 font-black text-xs shadow-[0_0_15px_rgba(255,255,255,0.4)] select-none"
                            >
                              <span>▲</span>
                              <span className="text-[9px]">JUMP</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DEFAULT OTHER WINDOWS */}
                  {activeWindow !== "Video" && activeWindow !== "Image1" && activeWindow !== "CLICK ME" && (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      <p className="text-white font-bold mb-2">{activeWindow} System File</p>
                      <p>System error 404: File corrupted or moved.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RETRO TASKBAR */}
          <div className="relative z-10 bg-zinc-300 border-t-2 border-white text-black px-3 py-1.5 flex justify-between items-center font-bold text-xs shadow-[0px_-2px_0px_#888]">
            <a
              href="/"
              className="flex items-center space-x-2 bg-zinc-200 border-2 border-zinc-500 border-r-black border-b-black px-3 py-1 active:translate-x-0.5 active:translate-y-0.5"
            >
              <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
                <div className="bg-red-500" />
                <div className="bg-green-500" />
                <div className="bg-blue-500" />
                <div className="bg-yellow-500" />
              </div>
              <span>EXIT OS / HOME</span>
            </a>

            <div className="border-2 border-zinc-500 border-t-black border-l-black px-3 py-1 bg-zinc-200 text-zinc-800 flex items-center space-x-2">
              <span>🔊</span>
              <span>{time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

