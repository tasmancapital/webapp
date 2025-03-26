import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CurrentDeals = () => {
  const deals = [
    {
      name: 'Tasman Environmental Markets',
      description: 'A leading environmental markets project developer and carbon credit trader in the Asia Pacific region.',
      image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
      year: '2023',
    },
    {
      name: 'Mainstream Group',
      description: 'A leading fund administrator and custodian providing services to the financial services industry.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80',
      year: '2022',
    },
  ];

  return (
    <section id="current-deals" className="section-padding bg-zinc-800">
      <div className="container-xl">
        <h2 className="heading-lg text-center mb-16">Current Portfolio</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {deals.map((deal) => (
            <div 
              key={deal.name}
              className="group relative overflow-hidden bg-zinc-900 rounded-lg"
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
                  <span className="text-sm text-zinc-400">{deal.year}</span>
                </div>
                <p className="text-zinc-400 mb-6">{deal.description}</p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-sm font-medium text-white hover:text-zinc-300 transition-colors"
                >
                  <span>Learn more</span>
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

export default CurrentDeals;