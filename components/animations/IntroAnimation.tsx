"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

export function IntroAnimation({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated beam canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase === "done") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const beams: {
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      width: number;
      hue: number;
      opacity: number;
    }[] = [];

    // Create initial beams
    for (let i = 0; i < 30; i++) {
      beams.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        angle: (Math.PI * 2 * i) / 30 + Math.random() * 0.3,
        speed: 2 + Math.random() * 4,
        length: 50 + Math.random() * 150,
        width: 1 + Math.random() * 2,
        hue: 190 + Math.random() * 60, // cyan to purple range
        opacity: 0.3 + Math.random() * 0.5,
      });
    }

    let frame: number;
    let t = 0;

    function animate() {
      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      t += 0.02;

      beams.forEach((beam) => {
        const cx = w / 2;
        const cy = h / 2;

        beam.angle += 0.003;
        const dist = beam.speed * t * 15;

        const x1 = cx + Math.cos(beam.angle) * dist;
        const y1 = cy + Math.sin(beam.angle) * dist;
        const x2 = cx + Math.cos(beam.angle) * (dist + beam.length);
        const y2 = cy + Math.sin(beam.angle) * (dist + beam.length);

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `hsla(${beam.hue}, 80%, 65%, 0)`);
        gradient.addColorStop(0.5, `hsla(${beam.hue}, 80%, 65%, ${beam.opacity * Math.max(0, 1 - t * 0.3)})`);
        gradient.addColorStop(1, `hsla(${beam.hue}, 80%, 65%, 0)`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.lineCap = "round";
        ctx.stroke();
      });

      // Center glow
      const glowRadius = 80 + Math.sin(t * 2) * 20;
      const glow = ctx.createRadialGradient(
        w / 2, h / 2, 0,
        w / 2, h / 2, glowRadius
      );
      glow.addColorStop(0, `rgba(56, 189, 248, ${0.15 * Math.max(0, 1 - t * 0.3)})`);
      glow.addColorStop(0.5, `rgba(129, 140, 248, ${0.08 * Math.max(0, 1 - t * 0.3)})`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  // Phase timing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1800);
    const t2 = setTimeout(() => setPhase("done"), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {phase !== "done" && (
          <motion.div
            key="intro"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#030712",
              pointerEvents: "none",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Beam canvas */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />

            {/* Logo + text */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              {/* Rotating ring */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 120,
                  height: 120,
                  marginTop: -60,
                  marginLeft: -60,
                  borderRadius: "50%",
                  border: "1px solid rgba(56, 189, 248, 0.2)",
                  borderTopColor: "rgba(56, 189, 248, 0.6)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />

              {/* Second ring */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 90,
                  height: 90,
                  marginTop: -45,
                  marginLeft: -45,
                  borderRadius: "50%",
                  border: "1px solid rgba(129, 140, 248, 0.15)",
                  borderBottomColor: "rgba(129, 140, 248, 0.5)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Logo icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 56,
                  height: 56,
                  background: "linear-gradient(135deg, #38bdf8, #818cf8)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  color: "#000",
                  boxShadow: "0 0 40px rgba(56, 189, 248, 0.4), 0 0 80px rgba(129, 140, 248, 0.2)",
                }}
              >
                <TrendingUp size={28} />
              </motion.div>

              {/* Brand name */}
              <motion.h1
                initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  marginTop: "1.5rem",
                  background: "linear-gradient(135deg, #f1f5f9, #94a3b8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                NovaScaling
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{
                  color: "#475569",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "0.5rem",
                }}
              >
                Rise above the grind
              </motion.p>

              {/* Loading bar */}
              <motion.div
                style={{
                  width: 200,
                  height: 2,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 1,
                  margin: "2rem auto 0",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #38bdf8, #818cf8)",
                    borderRadius: 1,
                  }}
                />
              </motion.div>
            </div>

            {/* Reveal wipe — two panels slide apart */}
            {phase === "reveal" && (
              <>
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: "-100%" }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    background: "#030712",
                    zIndex: 2,
                  }}
                />
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    background: "#030712",
                    zIndex: 2,
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page content — starts hidden, fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
}

export default IntroAnimation;
