import React, { useEffect, useRef } from 'react';
import { useTheme } from '../lib/ThemeContext';

interface WaveBackgroundProps {
  className?: string;
}

const WaveBackground: React.FC<WaveBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const waves = 3;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      for (let i = 0; i < waves; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Draw wave path
        for (let x = 0; x <= width; x += 1) {
          const y = Math.sin(x * 0.01 + time + i * 2) * 20 + 
                   Math.sin(x * 0.02 + time * 1.5 + i) * 15;
                   
          ctx.lineTo(x, height * 0.5 + y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Create gradient based on theme with increased base opacity
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const baseAlpha = theme === 'dark' ? 0.12 : 0.08; // Increased from 0.07/0.04
        const alpha = baseAlpha - i * 0.02; // Increased step between waves
        
        if (theme === 'dark') {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.8})`); // Adjusted middle point
          gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
        } else {
          gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.8})`); // Adjusted middle point
          gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha})`);
        }

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      time += 0.005;
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ mixBlendMode: theme === 'dark' ? 'plus-lighter' : 'multiply' }}
    />
  );
};

export default WaveBackground;