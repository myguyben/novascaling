"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: 3,
        width,
        background: "linear-gradient(to right, #f59e0b, #ea580c)",
        zIndex: 101,
        transformOrigin: "left",
      }}
    />
  );
}

export default ScrollProgress;
