import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MarketOpportunity = () => {
  const opportunities = [
    {
      icon: Target,
      title: 'Uniquely Positioned',
      description: 'Tasman sits in a market sweet spot as experienced middle market managers, specializing in defensive, operational improvements and aggregation deals across Australia and New Zealand.',
      stats: ['22,000+ businesses in target market', '$10M-$250M revenue range']
    },
    {
      icon: BarChart3,
      title: 'Market Leadership',
      description: 'The middle market dominates Australian M&A with over 80% of deals valued at $200M or less, creating consistent opportunities for strategic growth and value creation.',
      stats: ['80% of deals under $200M', 'Multiple exit routes available']
    },
    {
      icon: TrendingUp,
      title: 'Proven Returns',
      description: 'Private equity investments in Australia have consistently produced superior returns over a 10-year period compared to the US and other developed markets.',
      stats: ['Top quartile performance', 'Consistent outperformance']
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background"></div>
      
      <div className="container-xl py-24 md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="heading-xl mb-8 md:mb-10">
            <div className="relative inline-block">
              <span className="relative z-10">Market</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
            <br />
            <div className="relative inline-block">
              <span className="relative z-10">Opportunity</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
          </h2>
          <p className="description-text max-w-3xl mx-auto">
            Australia and New Zealand's middle market offers compelling private equity 
            opportunities with consistent returns and multiple value creation pathways.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16">
          {opportunities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-8 group hover:bg-primary/10 transition-all duration-500"
            >
              <div className="relative z-10">
                <item.icon className="w-12 h-12 mb-6 text-primary" />
                <h3 className="text-2xl font-light mb-4 text-foreground">{item.title}</h3>
               <p className="text-base text-muted-foreground leading-relaxed mb-6">
                 {item.description}
               </p>
                <ul className="space-y-3">
                  {item.stats.map((stat, i) => (
                   <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-3" />
                      {stat}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-3 px-8 py-3 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-300"
          >
            <span>View our portfolio</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketOpportunity;