import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface Card {
  category: string;
  title: string;
  description: string;
  points: string[];
  icon: any;
  image: string;
}

export const Card = ({ card, index }: { card: Card; index: number }) => {
  return (
    <motion.div
      className="group relative h-full w-full perspective-1000"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-zinc-900/90 backdrop-blur-sm border border-white/10 p-8 transition-all duration-500 group-hover:border-white/20">
        <div className="relative z-10">
          <div className="mb-4 text-sm font-medium text-zinc-400 tracking-wide">{card.category}</div>
          <div className="flex items-center gap-4 mb-6">
            <card.icon className="w-8 h-8 text-white" />
            <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
          </div>
          <p className="mb-8 text-zinc-300">{card.description}</p>
          <div className="space-y-4">
            {card.points.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-center text-zinc-300 transition-transform duration-300 hover:translate-x-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mr-4" />
                {point}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <img
            src={`https://images.unsplash.com/${card.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80`}
            alt={card.title}
            className="h-full w-full object-cover opacity-10 transition-all duration-500 group-hover:scale-105 group-hover:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 to-zinc-900/50" />
        </div>
      </div>
    </motion.div>
  );
};

export const Carousel = ({ items }: { items: Card[] }) => {
  return (
    <div className="relative w-full overflow-hidden py-20">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {items.map((item, index) => (
            <Card key={item.title} card={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};