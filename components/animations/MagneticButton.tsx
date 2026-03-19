"use client";

import { useRef, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

const MAX_OFFSET = 8;
const SPRING_CONFIG = { stiffness: 200, damping: 15, mass: 0.5 };

export function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, SPRING_CONFIG);
  const y = useSpring(0, SPRING_CONFIG);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxDim = Math.max(rect.width, rect.height);
      const normalizedX = (deltaX / maxDim) * MAX_OFFSET * 2;
      const normalizedY = (deltaY / maxDim) * MAX_OFFSET * 2;

      x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, normalizedX)));
      y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, normalizedY)));
    },
    [x, y]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}
export default MagneticButton;
