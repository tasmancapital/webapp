import { useState, useEffect } from "react";

export default function AnimatedShieldIcon({
  size = 64,
  color = "black",
  strokeWidth = 2,
  pulseDuration = 2,
  rotateDuration = 4,
  className = "",
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
  pulseDuration?: number;
  rotateDuration?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const totalSize = size * 1.5; // Increase size to accommodate the pulse effect

  return (
    <div 
      className={`relative inline-block ${className}`} 
      style={{ width: totalSize, height: totalSize }}
    >
      {/* Pulsing circle */}
      <div
        className="absolute inset-0 rounded-full animate-shield-pulse"
        style={{
          border: `${strokeWidth}px solid ${color}`,
          animationDuration: `${pulseDuration}s`
        }}
      />

      {/* Shield icon */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-shield-rotate"
        style={{
          width: size,
          height: size,
          animationDuration: `${rotateDuration}s`
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 1.5L3 5.25V11.25C3 16.5 6.75 21.25 12 22.5C17.25 21.25 21 16.5 21 11.25V5.25L12 1.5Z" />
        </svg>
      </div>
    </div>
  );
}