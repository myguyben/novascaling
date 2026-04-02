"use client";

export function OzioLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ozio-warm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="34" stroke="url(#ozio-warm)" strokeWidth="4" />
      <line x1="10" y1="40" x2="70" y2="40" stroke="url(#ozio-warm)" strokeWidth="2.5" />
      <path d="M22 40 A18 18 0 0 1 58 40" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
    </svg>
  );
}

export default OzioLogo;
