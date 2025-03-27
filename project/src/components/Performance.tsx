import { motion } from 'framer-motion';
import RubiksCube from './RubiksCube';
import OperationalGear from './OperationalGear';
import RollUps from './RollUps';

const Performance = () => {
  const strategies = [
    {
      title: 'Defensive',
      description: 'Non-discretionary businesses that are resilient through economic cycles, typically with long-term contracts or asset backed.',
    },
    {
      title: 'Operational Improvement',
      description: 'Cash-generative underperforming business, enhancing profitability by driving topline revenue growth and optimising operational efficiency.',
    },
    {
      title: 'Roll-ups',
      description: 'Consolidation of sectors to create platforms and economies of scale, building market leaders through strategic acquisitions.',
    }
  ];

  return (
    <section 
      className="section-padding relative overflow-hidden"
      data-sb-object-id="performance"
    >
      <div className="absolute inset-0 bg-background"></div>
      
      <div className="container-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-light tracking-tight leading-[1.1] mb-4 md:mb-6"
            data-sb-field-path="title"
          >
            <div className="relative inline-block">
              <span className="relative z-10 text-foreground">Strategies</span>
             </div>
            </h2>
          <p 
            className="description-text max-w-3xl mx-auto mb-8"
            data-sb-field-path="description"
          >
            Our investment approach focuses on three core strategies that have consistently 
            delivered superior returns across market cycles.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative h-[400px]"
              data-sb-field-path={`strategies.${index}`}
            >
              <div className="absolute inset-0 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-8">
                <div className="relative h-full flex flex-col">
                  <h3 
                    className="text-2xl font-medium mb-4 text-zinc-900 dark:text-white"
                    data-sb-field-path="title"
                  >
                    {strategy.title}
                  </h3>
                  <p 
                    className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed"
                    data-sb-field-path="description"
                  >
                    {strategy.description}
                  </p>
                  
                  {strategy.title === 'Defensive' && (
                    <div className="absolute bottom-0 right-0 w-24 h-24">
                      <RubiksCube />
                    </div>
                  )}
                  {strategy.title === 'Operational Improvement' && (
                    <div className="absolute bottom-0 right-0 w-24 h-24">
                      <OperationalGear />
                    </div>
                  )}
                  {strategy.title === 'Roll-ups' && (
                    <div className="absolute bottom-0 right-0 w-24 h-24">
                      <RollUps />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Performance;