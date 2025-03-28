import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

const data = [
  { name: 'Loscam', value: 4.5, irr: 105 },
  { name: 'HCA', value: 2.0, irr: 67 },
  { name: 'Tempo', value: 2.1, irr: 116 },
  { name: 'Bledisloe', value: 3.1, irr: 29 },
  { name: 'HireQuip', value: 1.2, irr: 54 },
  { name: 'FleetPartners', value: 2.8, irr: 17 },
  { name: 'TLC', value: 3.0, irr: 129 },
  { name: 'Right2Drive2', value: 3.1, irr: 227 },
  { name: 'Axicorp', value: 3.9, irr: 28 },
  { name: 'Serenitas', value: 2.4, irr: 27 }
];

const CustomDot = ({ cx, cy, payload, index }: any) => {
  return (
    <motion.circle
      initial={{ r: 0, opacity: 0 }}
      animate={{ r: 4, opacity: 1 }}
      whileHover={{ r: 6 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300
      }}
      cx={cx}
      cy={cy}
      fill="white"
      stroke="rgba(255, 255, 255, 0.3)"
      strokeWidth={2}
    />
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800/90 backdrop-blur-sm border border-white/10 p-4 rounded-lg shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.2,
            type: "spring",
            stiffness: 200
          }}
        >
          <p className="text-white font-medium mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-zinc-300 text-sm">
              <span className="inline-block w-20">Multiple:</span>
              <span className="font-medium text-white">{payload[0].value}x</span>
            </p>
            <p className="text-zinc-300 text-sm">
              <span className="inline-block w-20">IRR:</span>
              <span className="font-medium text-white">{payload[0].payload.irr}%</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  return null;
};

const PerformanceGraph = () => {
  return (
    <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading graph...</div>}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card p-6 h-[400px] bg-black/40"
      >
        <div className="glass-card-hover" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl font-semibold text-white/90"
            >
              Investment Performance
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm text-zinc-400"
            >
              Historical Returns (Multiple)
            </motion.div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#a1a1aa' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              />
              <YAxis
                tick={{ fill: '#a1a1aa' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                domain={[0, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.6)"
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: "white", stroke: "rgba(255, 255, 255, 0.4)", strokeWidth: 3 }}
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </Suspense>
  );
};

export default PerformanceGraph;