import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Timeline from '../components/Timeline';
import Globe from '../components/Globe';
import { ArrowRight, ChevronDown } from 'lucide-react';

const values = [
  {
    title: "Strategic Partnership",
    description: "We forge deep, collaborative relationships with management teams, providing not just capital, but strategic guidance, operational expertise, and access to our extensive network across the region.",
    points: [
      "Management team collaboration",
      "Strategic guidance and expertise",
      "Regional network access"
    ]
  },
  {
    title: "Value Creation",
    description: "Our approach combines disciplined investment strategy with hands-on operational improvement.",
    points: [
      "Defensive: Non-discretionary businesses resilient through economic cycles",
      "Operational: Improving underperforming businesses through cost and revenue initiatives",
      "Roll-ups: Consolidating sectors to create market leaders through strategic acquisitions"
    ]
  },
  {
    title: "Long-term Vision",
    description: "We take a patient, long-term approach to building sustainable businesses. Our track record of successful exits and strong returns is built on our ability to identify and execute transformative growth strategies.",
    points: [
      "Sustainable business growth",
      "Proven track record of exits",
      "Transformative strategies"
    ]
  }
];

const About = () => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://thinkenergy.au/tasman/tasman_captal_about.JPG"
              alt="Tasman Capital About"
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/15 to-background/5"></div>
          </div>
        </div>

        <div className="relative z-10 bg-gradient-to-b from-background via-background to-transparent -mt-32 pb-32">
          <div className="container-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 pt-24"
            >
              <h1 className="heading-xl mb-6">Who we are</h1>
              <p className="description-text max-w-3xl mx-auto">
                A leading private investment firm focused on partnering with exceptional management teams to build great businesses across Australia and New Zealand.
                <br /><br />
                Like Abel Tasman, Tasman Capital is at the forefront of identifying and capitalising on new opportunities on both sides of the Tasman Sea; in Australia and New Zealand.
              </p>
            </motion.div>
          </div>
        </div>

        {/* History Timeline */}
        <section id="history" className="pt-0 pb-8">
          <div className="container-xl">
            <div className="text-center mb-8">
              <h2 className="heading-lg mb-6">Our History</h2>
              <p className="description-text max-w-3xl mx-auto">
                From our founding in 1999 to present day, explore the key milestones 
                that have shaped Tasman Capital's journey in private investment.
              </p>
            </div>
            <Timeline />
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-background">
          <div className="container-xl">
            <div className="mb-16">
              <h2 className="heading-lg mb-6">Our Values</h2>
              <p className="description-text max-w-3xl">
                At Tasman Capital, we are guided by a set of core principles that define our investment philosophy and approach to value creation. Our commitment to operational excellence, strategic growth, and sustainable partnerships has been the cornerstone of our success across Australia and New Zealand.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4 text-left">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full group relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 p-6 transition-all duration-300 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium">{value.title}</h3>
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
                            <p className="description-text mb-6 text-left">
                              {value.description}
                            </p>
                            <div className="space-y-3 text-left">
                              {value.points.map((point, i) => (
                                <motion.div
                                  key={point}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                 className="flex items-center gap-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed"
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative group perspective-1000"
                  >
                    <div className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:translate-y-[-8px]">
                      <img
                        src="https://thinkenergy.au/tasman/abel-tasman-map.JPG"
                        alt="Abel Tasman's Historical Map"
                        className="w-full aspect-square object-cover rounded-2xl sepia scale-[1.1] object-center"
                      />
                    
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-200 dark:border-white/10 rounded-b-2xl"
                      >
                        <p className="text-sm font-light italic text-zinc-600 dark:text-zinc-300">
                          "Like Abel Tasman's pioneering voyages, we navigate uncharted territories in search of exceptional opportunities."
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                  </div>
              </div>
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;