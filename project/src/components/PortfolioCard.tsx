import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface Deal {
  name: string;
  description: string;
  image: string;
  year: string;
  exit?: string;
}

interface PortfolioCardProps {
  deal: Deal;
  type: 'current' | 'past';
}

const PortfolioCard = ({ deal, type }: PortfolioCardProps) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 transition-all duration-500 hover:bg-white/10"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={deal.image}
          alt={deal.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold">{deal.name}</h3>
          {type === 'current' ? (
            <span className="text-sm text-zinc-400">{deal.year}</span>
          ) : (
            <div className="text-right">
              <div className="text-sm text-zinc-400">Investment: {deal.year}</div>
              <div className="text-sm text-zinc-400">Exit: {deal.exit}</div>
            </div>
          )}
        </div>
        <p className="text-zinc-400 mb-6">{deal.description}</p>
        <a 
          href="#" 
          className="inline-flex items-center text-sm font-medium text-white hover:text-zinc-300 transition-colors"
        >
          <span>{type === 'current' ? 'Learn more' : 'View case study'}</span>
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default PortfolioCard;