"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TypewriterTextProps {
  phrases: string[];
  className?: string;
  speed?: number;
  pauseDuration?: number;
}

export function TypewriterText({
  phrases,
  className,
  speed = 50,
  pauseDuration = 2000,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const tick = useCallback(() => {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        timeoutRef.current = setTimeout(tick, speed);
      } else {
        // Finished typing, pause then delete
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
          tick();
        }, pauseDuration);
        return;
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
        timeoutRef.current = setTimeout(tick, speed / 2);
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [displayText, phraseIndex, isDeleting, phrases, speed, pauseDuration]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, speed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick, speed]);

  return (
    <span className={className}>
      {displayText}
      <span
        style={{
          opacity: showCursor ? 1 : 0,
          transition: "opacity 0.1s",
          fontWeight: 100,
        }}
        aria-hidden="true"
      >
        |
      </span>
    </span>
  );
}
export default TypewriterText;
