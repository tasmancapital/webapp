import React from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const investments = [
  {
    name: 'Axicorp',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Axicorp.webp',
    url: '/investments#axicorp',
    type: 'Realised Investment',
    exit: '2022'
  },
  {
    name: 'Bledisloe',
    logo: 'https://thinkenergy.au/tasman/pastdeals/BL+LOGO.png',
    url: '/investments#bledisloe',
    type: 'Realised Investment',
    exit: '2010'
  },
  {
    name: 'FleetPartners',
    logo: 'https://thinkenergy.au/tasman/pastdeals/FP.png',
    url: '/investments#fleetpartners',
    type: 'Realised Investment',
    exit: '2015'
  },
  {
    name: 'Healthcare Australia',
    logo: 'https://thinkenergy.au/tasman/pastdeals/HCA.png',
    url: '/investments#healthcare-australia',
    type: 'Realised Investment',
    exit: '2005'
  },
  {
    name: 'HireQuip',
    logo: 'https://thinkenergy.au/tasman/pastdeals/HQ.png',
    url: '/investments#hirequip',
    type: 'Realised Investment',
    exit: '2007'
  },
  {
    name: 'Loscam',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Ep.png',
    url: '/investments#loscam',
    type: 'Realised Investment',
    exit: '2005'
  },
  {
    name: 'Right2Drive',
    logo: 'https://thinkenergy.au/tasman/pastdeals/R&D.png',
    url: '/investments#right2drive',
    type: 'Realised Investment',
    exit: '2016'
  },
  {
    name: 'Serenitas',
    logo: 'https://thinkenergy.au/tasman/serenitas.png',
    url: '/investments#serenitas',
    type: 'Realised Investment',
    exit: '2024'
  },
  {
    name: 'Tasman Holiday Parks',
    logo: 'https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp',
    url: '/investments#tasman-holiday-parks',
    type: 'Current Investment'
  },
  {
    name: 'Tasman Lifestyle Continuum',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Tas+LCG.png',
    url: '/investments#tasman-lifestyle-continuum',
    type: 'Realised Investment',
    exit: '2015'
  },
  {
    name: 'Tempo',
    logo: 'https://thinkenergy.au/tasman/pastdeals/temp.png',
    url: '/investments#tempo',
    type: 'Realised Investment',
    exit: '2006'
  },
  {
    name: 'Tasman Serenitas Continuation Fund',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Tasman Serenitas Continuation Fund.png',
    url: '/investments#tasman-serenitas-continuation-fund',
    type: 'Current Investment'
  }
];

const PastInvestments = () => {
  const controls = useAnimationControls();
  const navigate = useNavigate();

  const handleLogoClick = (url: string) => {
    navigate(url);
  };

  React.useEffect(() => {
    controls.start({
      x: [-2070, 0],
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity
      }
    });
  }, [controls]);

  return (
    <section 
      className="section-padding"
      data-sb-object-id="pastInvestments"
    >
      <div className="container-xl mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 
            className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-light tracking-tight leading-[1.1] mb-6 text-foreground"
            data-sb-field-path="title"
          >
            <div className="relative inline-block">
              <span className="relative z-10">Investments</span>
            </div>
          </h2>
        </motion.div>
      </div>

      <div 
        className="relative w-full overflow-hidden px-4"
        data-sb-field-path="investmentsContainer"
      >
        <motion.div
          animate={controls}
          className="flex gap-8"
          style={{ 
            width: "max-content",
            paddingLeft: "2rem",
            paddingRight: "2rem"
          }}
        >
          {[...investments, ...investments].map((investment, index) => (
            <button
              key={`${investment.name}-${index}`}
              onClick={() => handleLogoClick(investment.url)}
              className="relative h-[111px] w-[186px] flex-none p-4 transition-transform duration-300 hover:scale-95"
              data-sb-field-path={index < investments.length ? `investments.${index}` : undefined}
            >
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={investment.logo}
                  alt={investment.name}
                  className="w-full h-full object-contain"
                  data-sb-field-path={index < investments.length ? `investments.${index}.logo` : undefined}
                />
              </div>
            </button>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export default PastInvestments;