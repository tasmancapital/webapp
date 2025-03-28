import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { getContent, annotateContent } from '../lib/contentLoader';

interface Investment {
  name: string;
  id: string;
  logo: string;
  type: string;
  url: string;
  description: string;
  sector: string;
  investment: string;
  exit?: string;
}

interface InvestmentsContent {
  title: string;
  description: string;
  heroImage: string;
  investments: Investment[];
}

function Investments() {
  // Get the investments content
  const content = getContent<InvestmentsContent>('investments');
  
  const [sortConfig, setSortConfig] = React.useState({
    key: 'exit',
    direction: 'descending'
  });
  
  const [filter, setFilter] = React.useState('all');
  
  React.useEffect(() => {
    // Scroll to investment if hash is present
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // Wait for animations to complete
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }, 500);
      }
    }
  }, []);

  const sortedInvestments = React.useMemo(() => {
    const investmentsData = content.investments || [];
    // First filter by type
    let filtered = [...investmentsData];
    if (filter !== 'all') {
      const isCurrentType = filter === 'current';
      filtered = filtered.filter(inv => 
        isCurrentType ? inv.type === 'Current Investment' : inv.type === 'Realised Investment'
      );
    }

    // Sort by exit date
    return filtered.sort((a, b) => {
      // Put non-exited (current) investments at the top for descending
      if (!a.exit && !b.exit) return 0;
      if (!a.exit) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (!b.exit) return sortConfig.direction === 'ascending' ? -1 : 1;
      
      // Parse exit years as integers
      const exitYearA = parseInt(a.exit || '0');
      const exitYearB = parseInt(b.exit || '0');
      return sortConfig.direction === 'ascending' ? exitYearA - exitYearB : exitYearB - exitYearA;
    });
  }, [filter, content, sortConfig]);

  return (
    <div {...annotateContent('investments')} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={content.heroImage} 
              alt="Investments" 
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
              data-sb-field-path="heroImage"
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
              <h1 
                className="heading-xl mb-6"
                data-sb-field-path="title"
              >
                {content.title}
              </h1>
              <p 
                className="description-text max-w-3xl mx-auto"
                data-sb-field-path="description"
              >
                {content.description}
              </p>
            </motion.div>
          </div>
        </div>
        
        <section className="py-16 px-4">
          <div className="container-xl mx-auto">
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Filter:</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filter === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('current')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filter === 'current'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setFilter('realised')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filter === 'realised'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      Realised
                    </button>
                  </div>
                </div>
                {/* Hidden sort button that still handles sorting functionality */}
                <div className="hidden">
                  <button
                    onClick={() => setSortConfig({ 
                      key: 'exit', 
                      direction: sortConfig.direction === 'descending' ? 'ascending' : 'descending' 
                    })}
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Exit Order</span>
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-sb-field-path="investments"
            >
              {sortedInvestments.map((investment, index) => (
                <motion.div
                  key={investment.name}
                  id={investment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-full perspective-[2000px]"
                  data-sb-field-path={`.${index}`}
                >
                  <div className="relative h-full w-full transition-all duration-700 transform-style-3d group-hover:rotate-y-12 group-hover:rotate-x-12 group-hover:translate-y-[-8px]">
                    <div className="h-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col">
                      <div className="relative h-[160px] overflow-hidden">
                        <div className="absolute inset-0 p-4 flex items-center justify-center">
                          <img
                            src={investment.logo}
                            alt={investment.name}
                            className="max-w-[200px] max-h-[100px] w-auto h-auto object-contain"
                            data-sb-field-path="logo"
                          />
                        </div>
                      </div>

                      <div className="relative z-10 p-8">
                        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${
                          investment.type === 'Current Investment'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}
                        data-sb-field-path="type"
                        >
                          {investment.type}
                        </span>

                        <h3 
                          className="text-xl font-medium mb-3 text-zinc-900 dark:text-white"
                          data-sb-field-path="name"
                        >
                          {investment.name}
                        </h3>
                        
                        <p 
                          className="text-zinc-600 dark:text-zinc-300 mb-6"
                          data-sb-field-path="description"
                        >
                          {investment.description}
                        </p>
                        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <p 
                            className="border-b border-zinc-100 dark:border-white/10 py-2"
                            data-sb-field-path="sector"
                          >
                            <span>Sector: {investment.sector}</span>
                          </p>
                          <p 
                            className="border-b border-zinc-100 dark:border-white/10 py-2"
                            data-sb-field-path="investment"
                          >
                            <span>Investment: {investment.investment}</span>
                          </p>
                          {investment.exit && (
                            <p 
                              className="border-b border-zinc-100 dark:border-white/10 py-2"
                              data-sb-field-path="exit"
                            >
                              <span>Exit: {investment.exit}</span>
                            </p>
                          )}
                        </div>

                        <div className="absolute bottom-8 right-8">
                          <a 
                            href={investment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-white/20 transition-colors"
                            data-sb-field-path="url"
                          >
                            <ArrowUpRight className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <div className="container-xl pb-16">
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            For more information about our investments, please <a href="/contact" className="text-primary hover:underline">contact us</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Investments;