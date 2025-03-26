import React, { useRef, useEffect } from 'react';
import createGlobe from 'cobe';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0.4,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.2, 0.2, 0.2],
      markerColor: [0.5, 0.5, 0.5],
      glowColor: [0.5, 0.5, 0.5],
      markers: [
        // Sydney coordinates
        { location: [-33.8688, 151.2093], size: 0.1 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-contain max-w-[100vw] max-h-[60vh] md:max-h-full"
    />
  );
};

export default Globe;