import React, { useState } from 'react';
import { Compass, Ship, Map, ArrowUpRight } from 'lucide-react';

const Approach = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const strategies = [
    {
      title: 'The Explorer',
      icon: Ship,
      description: 'Abel Tasman, the Dutch explorer who in 1642 was the first European to map the Eastern coast of Australia and to "discover" New Zealand.',
      points: [
        'First European to map Eastern Australia',
        'Discovered New Zealand in 1642',
        'Skilled navigator and explorer',
        'Pioneer of new territories'
      ]
    },
    {
      title: 'Trading Routes',
      icon: Map,
      description: 'An experienced explorer who established crucial trading routes throughout South East Asia, connecting Indonesia, Japan, and Cambodia.',
      points: [
        'Established Asian trading routes',
        'Connected multiple regions',
        'Created lasting partnerships',
        'Built strategic networks'
      ]
    },
    {
      title: 'Our Heritage',
      icon: Compass,
      description: 'Like Abel Tasman, we are at the forefront of identifying and capitalising on new opportunities on both sides of the Tasman Sea.',
      points: [
        'Australia-NZ focus',
        'Pioneering investments',
        'Strategic partnerships',
        'Value creation across regions'
      ]
    }
  ];

  return (
    <section id="approach" className="section-padding bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container-xl">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-6">
            <div className="relative inline-block">
              <span className="text-gradient relative z-10">Tasman the Explorer</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
          </h2>
          <p className="description-text max-w-3xl mx-auto">
            Our name and approach are inspired by Abel Tasman's spirit of exploration and discovery.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {strategies.map((strategy, index) => (
            <button
              key={strategy.title}
              onClick={() => setActiveTab(index)} 
              className={`relative overflow-hidden rounded-lg border bg-primary/5 text-card-foreground p-8 text-left group transition-all duration-300 ${
                activeTab === index 
                  ? 'ring-2 ring-primary border-primary/20 bg-primary/10'
                  : 'hover:bg-primary/10 border-primary/10'
              }`}
            >
              <div className="relative z-10">
              <strategy.icon className={`w-8 h-8 mb-6 transition-colors duration-300 ${
                activeTab === index ? 'text-primary' : 'text-primary/60'
              }`} />
              <h3 className="text-2xl font-light mb-4 text-foreground">{strategy.title}</h3>
              <p className="description-text">
                {strategy.description}
              </p>
              <ArrowUpRight className={`w-5 h-5 mt-6 transition-all duration-500 ${
                activeTab === index ? 'translate-x-1 translate-y-[-4px] text-primary' : 'text-primary/60'
              }`} />
              </div>
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-lg border border-primary/10 bg-primary/5 text-card-foreground p-8 md:p-12 group hover:bg-primary/10 transition-colors duration-300">
          <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-light mb-6 text-foreground">{strategies[activeTab].title}</h3>
              <ul className="space-y-4">
                {strategies[activeTab].points.map((point, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-foreground transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-4 transition-all duration-300 group-hover:bg-primary/60" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
              <img
                src="https://images.unsplash.com/photo-1534329539061-64caeb388c42?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80"
                alt="Investment Strategy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent" />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;