import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Strategy {
  title: string;
  description: string;
  points: string[];
  icon: any;
  image: string;
}

interface ApproachCarouselProps {
  strategies: Strategy[];
}

const ApproachCarousel: React.FC<ApproachCarouselProps> = ({ strategies }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div ref={targetRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="flex w-full">
          <div className="container-xl">
            {strategies.map((strategy, i) => {
              const translateX = useTransform(
                scrollYProgress,
                [i / strategies.length, (i + 1) / strategies.length],
                ["0%", "-100%"]
              );

              const scale = useTransform(
                scrollYProgress,
                [i / strategies.length, (i + 1) / strategies.length],
                [1, isMobile ? 0.8 : 0.9]
              );

              const opacity = useTransform(
                scrollYProgress,
                [i / strategies.length, (i + 0.5) / strategies.length],
                [1, 0]
              );

              return (
                <motion.div
                  key={strategy.title}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    translateX,
                    scale,
                    opacity,
                  }}
                  className="flex items-center justify-center px-4"
                >
                  <div className="w-full max-w-6xl mx-auto">
                    <motion.div
                      className="glass-card overflow-hidden"
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        <div className="p-8 md:p-12 space-y-6">
                          <div className="flex items-center gap-4">
                            <strategy.icon className="w-8 h-8 text-white" />
                            <h2 className="text-2xl md:text-3xl font-semibold">{strategy.title}</h2>
                          </div>
                          <p className="text-lg text-zinc-300">{strategy.description}</p>
                          <ul className="space-y-4">
                            {strategy.points.map((point, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="flex items-center text-zinc-300"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mr-4" />
                                {point}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="relative aspect-[4/3] md:aspect-auto">
                          <img
                            src={`https://images.unsplash.com/${strategy.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80`}
                            alt={strategy.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproachCarousel;