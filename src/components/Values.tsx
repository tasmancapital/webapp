import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
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
  const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default first item open
  
  // Toggle accordion function
  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section 
      className="section-padding bg-background py-20"
      {...annotateContent('components/values-section')}
    >
      <div className="container-xl">
        <div className="mb-16 text-center">
          <h2 
            className="heading-lg mb-6 relative inline-block"
            data-sb-field-path="title"
          >
            <span className="relative z-10">{title}</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
          </h2>
          <p 
            className="description-text max-w-4xl mx-auto px-4"
            data-sb-field-path="description"
          >
            {description}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6 text-left order-2 lg:order-1">
            {values && values.map((value, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  data-sb-field-path={`values.${index}`}
                  className="rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className={`w-full group relative overflow-hidden rounded-t-xl p-6 transition-all duration-300 flex items-center justify-between ${isActive ? 'bg-primary text-white' : 'bg-white shadow-sm hover:bg-gray-50'}`}
                  >
                    <h3 
                      className={`text-xl font-medium ${isActive ? 'text-white' : 'text-gray-800'}`}
                      data-sb-field-path=".title"
                    >
                      {value.title}
                    </h3>
                    <motion.div
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}
                    >
                      <ChevronDown className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 bg-white border border-gray-100 rounded-b-xl shadow-sm">
                          <p 
                            className="text-gray-700 mb-6 text-left"
                            data-sb-field-path=".description"
                          >
                            {value.description}
                          </p>
                          <div 
                            className="space-y-4 text-left"
                            data-sb-field-path=".points"
                          >
                            {value.points.map((point, i) => (
                              <motion.div
                                key={point}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 text-gray-700"
                                data-sb-field-path={`.${i}`}
                              >
                                <div className="mt-1 flex-shrink-0">
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                                    <Check className="w-3 h-3" />
                                  </div>
                                </div>
                                <span className="text-base leading-relaxed">{point}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden shadow-xl"
              >
                <img 
                  src={image} 
                  alt="Tasman Capital Values" 
                  className="w-full h-auto"
                  data-sb-field-path="image"
                />
              </motion.div>
              <div className="absolute -z-10 top-6 left-6 w-full h-full bg-primary/10 rounded-2xl"></div>
              <div className="mt-6 px-4 text-center">
                <p className="text-base italic text-gray-600 font-medium">
                  "Like Abel Tasman's pioneering voyages, we navigate uncharted territories in search of exceptional opportunities."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Values;
