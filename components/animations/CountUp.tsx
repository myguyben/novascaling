"use client";

import { useRef, useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function runAnimation() {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();

      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutExpo(progress);
        setDisplay(Math.round(eased * end));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }

    // Use native IntersectionObserver to avoid framer-motion SSR issues
    if (typeof IntersectionObserver === "undefined") {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default CountUp;
