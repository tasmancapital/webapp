import React from 'react';
import { motion } from 'framer-motion';

const awards = [
  {
    year: '2005',
    name: 'AVCAL', 
    image: 'https://thinkenergy.au/tasman/showcase/AVCAL.jpg',
    award: 'Management Buy In of the Year with Loscam'
  },
  {
    year: '2006', 
    name: 'AVCAL',
    image: 'https://thinkenergy.au/tasman/showcase/AVCAL.jpg', 
    award: 'Winner of Management Buyout of the Year with Healthcare Australia'
  },
  {
    year: '2015',
    name: 'Australian Growth Company Awards',
    image: 'https://thinkenergy.au/tasman/showcase/Autralian Growth Company Awards.jpg',
    award: 'Winner of Exit of the Year with Tasman Lifestyle Continuum'
  },
  {
    year: '2022',
    name: 'Australian Growth Company Awards',
    image: 'https://thinkenergy.au/tasman/showcase/Autralian Growth Company Awards.jpg',
    award: 'Winner of Company of the Year (Healthcare) with Serenitas'
  },
  {
    year: '2024',
    name: 'Australian Investment Council',
    image: 'https://thinkenergy.au/tasman/showcase/Australian Investment Council.jpg',
    award: 'Winner of Upper Mid Cap Deal with Serenitas'
  }
];

const LogoShowcase = () => {
  const sortedAwards = React.useMemo(() => {
    return [...awards].sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, []);

  return (
    <section className="py-8 pb-24 relative overflow-hidden w-full">      
      <div className="container-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-light tracking-tight leading-[1.1] mb-6 text-foreground">Industry Awards</h2>
          <p className="description-text max-w-3xl mx-auto">
            Industry award winners in 2005, 2006, 2022 and 2024
          </p>
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll-x will-change-transform" style={{ animation: 'scroll 30s linear infinite' }}>
          {[...sortedAwards, ...sortedAwards].map((award, index) => (
            <motion.div
              key={`${award.name}-${award.year}-${index}`}
              whileHover={{ scale: 0.98 }}
              className="inline-flex flex-none w-[280px] min-h-[240px] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 flex-col shadow-sm items-center p-4 sm:p-6 mx-3"
            >
              <div className="h-16 sm:h-20 flex items-center justify-center w-full mb-1 sm:mb-2">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-28 sm:w-36 h-14 sm:h-16 flex items-center justify-center"
                > 
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              <h3 className="text-sm sm:text-base font-medium text-foreground mb-1 sm:mb-2 text-center whitespace-normal w-full">
                {award.name}
              </h3>
              <div className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2 text-center">
                {award.year}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center whitespace-normal w-full">
                {award.award}
              </p>
            </motion.div>
          ))}
          {[...sortedAwards].map((award, index) => (
            <motion.div
              key={`${award.name}-${award.year}-${index}-clone`}
              whileHover={{ scale: 0.98 }}
              className="inline-flex flex-none w-[280px] min-h-[240px] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 flex-col shadow-sm items-center p-4 sm:p-6 mx-3"
            >
              <div className="h-16 sm:h-20 flex items-center justify-center w-full mb-1 sm:mb-2">
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-28 sm:w-36 h-14 sm:h-16 flex items-center justify-center"
                > 
                  <img
                    src={award.image}
                    alt={award.name}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              <h3 className="text-sm sm:text-base font-medium text-foreground mb-1 sm:mb-2 text-center whitespace-normal w-full">
                {award.name}
              </h3>
              <div className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2 text-center">
                {award.year}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center whitespace-normal w-full">
                {award.award}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export default LogoShowcase;