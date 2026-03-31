"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number }[];
}

export function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<
    "black" | "streak" | "impact" | "shockwave" | "dissolve" | "done"
  >("black");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwaveRef = useRef({ radius: 0, opacity: 1 });
  const streakRef = useRef({ x: -200, opacity: 0, hit: false });
  const frameRef = useRef(0);

  const spawnExplosion = useCallback((cx: number, cy: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 12;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        hue: 190 + Math.random() * 70,
        life: 1,
        maxLife: 60 + Math.random() * 80,
        trail: [],
      });
    }
    // Add some bigger slow ones
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 3;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        hue: 190 + Math.random() * 30,
        life: 1,
        maxLife: 100 + Math.random() * 60,
        trail: [],
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase === "done") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    let startTime = performance.now();

    function render(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime) / 1000;

      ctx.clearRect(0, 0, w, h);

      // === STREAK PHASE ===
      if (phase === "streak" || phase === "impact") {
        const streak = streakRef.current;

        if (!streak.hit) {
          streak.x += (w * 0.04);
          streak.opacity = Math.min(1, streak.opacity + 0.08);

          if (streak.x >= cx - 30) {
            streak.hit = true;
            setPhase("impact");
            spawnExplosion(cx, cy);
            shockwaveRef.current = { radius: 0, opacity: 1 };
          }
        }

        // Draw streak line with glow
        if (!streak.hit) {
          const grad = ctx.createLinearGradient(
            streak.x - 300, cy, streak.x, cy
          );
          grad.addColorStop(0, "rgba(56, 189, 248, 0)");
          grad.addColorStop(0.7, `rgba(56, 189, 248, ${streak.opacity * 0.6})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${streak.opacity})`);

          ctx.beginPath();
          ctx.moveTo(streak.x - 300, cy);
          ctx.lineTo(streak.x, cy);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.stroke();

          // Bright tip glow
          const tipGlow = ctx.createRadialGradient(
            streak.x, cy, 0, streak.x, cy, 30
          );
          tipGlow.addColorStop(0, `rgba(255, 255, 255, ${streak.opacity * 0.8})`);
          tipGlow.addColorStop(0.3, `rgba(56, 189, 248, ${streak.opacity * 0.4})`);
          tipGlow.addColorStop(1, "transparent");
          ctx.fillStyle = tipGlow;
          ctx.fillRect(streak.x - 30, cy - 30, 60, 60);
        }
      }

      // === IMPACT / SHOCKWAVE ===
      if (phase === "impact" || phase === "shockwave") {
        const sw = shockwaveRef.current;
        sw.radius += 8;
        sw.opacity = Math.max(0, 1 - sw.radius / (Math.max(w, h) * 0.7));

        // Shockwave ring
        if (sw.opacity > 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${sw.opacity * 0.5})`;
          ctx.lineWidth = 2 + sw.opacity * 4;
          ctx.stroke();

          // Second ring
          ctx.beginPath();
          ctx.arc(cx, cy, sw.radius * 0.85, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(129, 140, 248, ${sw.opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Center flash
        if (sw.radius < 100) {
          const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100 - sw.radius);
          flash.addColorStop(0, `rgba(255, 255, 255, ${Math.max(0, 0.6 - sw.radius / 100)})`);
          flash.addColorStop(1, "transparent");
          ctx.fillStyle = flash;
          ctx.fillRect(0, 0, w, h);
        }

        // Particles with trails
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 8) p.trail.shift();

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.vy += 0.02; // slight gravity
          p.life -= 1 / p.maxLife;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let j = 1; j < p.trail.length; j++) {
              ctx.lineTo(p.trail[j].x, p.trail[j].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 65%, ${p.life * 0.3})`;
            ctx.lineWidth = p.size * 0.5;
            ctx.stroke();
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life})`;
          ctx.fill();

          // Particle glow
          if (p.size > 2) {
            const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            pg.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.life * 0.3})`);
            pg.addColorStop(1, "transparent");
            ctx.fillStyle = pg;
            ctx.fillRect(p.x - p.size * 3, p.y - p.size * 3, p.size * 6, p.size * 6);
          }
        }

        // Ambient floating sparkles
        for (let i = 0; i < 5; i++) {
          const sx = Math.random() * w;
          const sy = Math.random() * h;
          const so = Math.random() * 0.3 * Math.max(0, 1 - elapsed * 0.3);
          ctx.beginPath();
          ctx.arc(sx, sy, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${so})`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, spawnExplosion]);

  // Phase timing
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("streak"), 400),
      setTimeout(() => {
        if (streakRef.current.hit) setPhase("shockwave");
      }, 1600),
      setTimeout(() => setPhase("dissolve"), 2600),
      setTimeout(() => setPhase("done"), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="intro-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#030712",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            exit={{
              opacity: 0,
              scale: 1.1,
              filter: "blur(10px)",
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />

            {/* Logo — appears on impact */}
            <AnimatePresence>
              {(phase === "impact" || phase === "shockwave" || phase === "dissolve") && (
                <motion.div
                  key="logo-reveal"
                  initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 1.5, opacity: 0, filter: "blur(12px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "relative",
                    zIndex: 10,
                    textAlign: "center",
                  }}
                >
                  {/* Pulsing halo */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 60px rgba(56,189,248,0.4), 0 0 120px rgba(129,140,248,0.2)",
                        "0 0 80px rgba(56,189,248,0.6), 0 0 160px rgba(129,140,248,0.3)",
                        "0 0 60px rgba(56,189,248,0.4), 0 0 120px rgba(129,140,248,0.2)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: 72,
                      height: 72,
                      background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                      borderRadius: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      color: "#000",
                    }}
                  >
                    <TrendingUp size={36} />
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20, letterSpacing: "0.3em" }}
                    animate={{ opacity: 1, y: 0, letterSpacing: "-0.03em" }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "clamp(2rem, 5vw, 3.5rem)",
                      fontWeight: 800,
                      marginTop: "1.5rem",
                      color: "#f1f5f9",
                    }}
                  >
                    Ozio
                    <span
                      style={{
                        background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {" "}Consulting
                    </span>
                  </motion.h1>

                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 120, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                      height: 1,
                      background: "linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)",
                      margin: "1rem auto",
                    }}
                  />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    style={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                    }}
                  >
                    Margin Expansion as a Service
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default IntroAnimation;
