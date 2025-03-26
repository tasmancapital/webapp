import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const PastDeals = () => {
  const deals = [
    {
      name: 'Axiom Telecom',
      description: 'Leading telecommunications retailer and distributor in the Middle East.',
      image: 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
      year: '2021',
      exit: '2023',
    },
    {
      name: 'Pacific Services Group',
      description: 'Provider of essential infrastructure services to the telecommunications and utilities sectors.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
      year: '2019',
      exit: '2022',
    },
  ];

  return (
    <section id="past-deals" className="section-padding bg-zinc-900">
      <div className="container-xl">
        <h2 className="heading-lg text-center mb-16">Past Investments</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {deals.map((deal) => (
            <div 
              key={deal.name}
              className="group relative overflow-hidden bg-zinc-800 rounded-lg"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{deal.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-zinc-400">Investment: {deal.year}</div>
                    <div className="text-sm text-zinc-400">Exit: {deal.exit}</div>
                  </div>
                </div>
                <p className="text-zinc-400 mb-6">{deal.description}</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium text-white hover:text-zinc-300 transition-colors"
                >
                  <span>View case study</span>
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PastDeals;