import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getContent, annotateContent } from '../lib/contentLoader';

interface ValuePoint {
  title: string;
  description: string;
  points: string[];
}

interface ValuesProps {
  title?: string;
  description?: string;
  image?: string;
  values?: ValuePoint[];
}

interface ValuesContent {
  type: string;
  title: string;
  description: string;
  image: string;
  values: ValuePoint[];
}

const Values = (props: ValuesProps = {}) => {
  // Get content from JSON file
  const content = getContent<ValuesContent>('components/values-section');
  
  // Use props if provided, otherwise use content from JSON
  const title = props.title || content.title;
  const description = props.description || content.description;
  const image = props.image || content.image;
  const values = props.values || content.values;
  
  // State for accordion
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Toggle accordion function
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section 
      className="section-padding bg-background"
      {...annotateContent('components/values-section')}
    >
      <div className="container-xl">
        <div className="mb-16">
          <h2 
            className="heading-lg mb-6"
            data-sb-field-path="title"
          >
            {title}
          </h2>
          <p 
            className="description-text max-w-3xl"
            data-sb-field-path="description"
          >
            {description}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-left">
            {values && values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                data-sb-field-path={`values.${index}`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full group relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <h3 
                      className="text-xl font-medium"
                      data-sb-field-path=".title"
                    >
                      {value.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 px-6 pb-6 rounded-b-2xl backdrop-blur-sm bg-white/5 border-x border-b border-white/10">
                        <p 
                          className="description-text mb-6 text-left"
                          data-sb-field-path=".description"
                        >
                          {value.description}
                        </p>
                        <div 
                          className="space-y-3 text-left"
                          data-sb-field-path=".points"
                        >
                          {value.points.map((point, i) => (
                            <motion.div
                              key={point}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed"
                              data-sb-field-path={`.${i}`}
                            >
                              <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                              <span>{point}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <div className="relative mt-12 lg:mt-0">
            <div className="max-w-lg mx-auto">
              <img 
                src={image} 
                alt="Tasman Capital Values" 
                className="w-full h-auto rounded-3xl"
                data-sb-field-path="image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
