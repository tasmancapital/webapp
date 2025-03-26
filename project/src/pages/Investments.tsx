import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowUpRight, ArrowUpDown, Calendar } from 'lucide-react';
import WaveBackground from '../components/WaveBackground';

const investments = [
  {
    name: 'Axicorp',
    id: 'axicorp',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Axicorp.webp',
    type: 'Realised Investment',
    url: 'https://www.axi.com/au',
    description: 'A leading global foreign exchange trading platform',
    sector: 'Financial Services',
    investment: '2016',
    exit: '2022'
  },
  {
    name: 'Bledisloe',
    id: 'bledisloe',
    logo: 'https://thinkenergy.au/tasman/pastdeals/BL+LOGO.png',
    type: 'Realised Investment',
    url: 'https://www.invocare.com.au/',
    description: 'The second largest funeral services provider in Australia and New Zealand.',
    sector: 'Healthcare',
    investment: '2005',
    exit: '2010'
  },
  {
    name: 'FleetPartners',
    id: 'fleetpartners',
    logo: 'https://thinkenergy.au/tasman/pastdeals/FP.png',
    type: 'Realised Investment',
    url: 'https://www.fleetpartners.com.au',
    description: 'Vehicle fleet management and leasing services',
    sector: 'Fleet Leasing',
    investment: '2008',
    exit: '2015'
  },
  {
    name: 'Healthcare Australia',
    id: 'healthcare-australia',
    logo: 'https://thinkenergy.au/tasman/pastdeals/HCA.png',
    type: 'Realised Investment',
    url: 'https://www.healthcareaustralia.com.au',
    description: 'Australia\'s largest homecare and nursing agency',
    sector: 'Healthcare',
    investment: '2004',
    exit: '2005'
  },
  {
    name: 'HireQuip',
    id: 'hirequip',
    logo: 'https://thinkenergy.au/tasman/pastdeals/HQ.png',
    type: 'Realised Investment',
    url: 'https://www.hirepool.co.nz',
    description: 'Market leader in dry hire equipment rental in New Zealand',
    sector: 'Construction',
    investment: '2006',
    exit: '2007'
  },
  {
    name: 'Loscam',
    id: 'loscam',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Ep.png',
    type: 'Realised Investment',
    url: 'https://www.loscam.com',
    description: 'Leading pallet pooling business in Asia Pacific',
    sector: 'Industrials',
    investment: '2003',
    exit: '2005'
  },
  {
    name: 'Right2Drive',
    id: 'right2drive',
    logo: 'https://thinkenergy.au/tasman/pastdeals/R&D.png',
    type: 'Realised Investment',
    url: '#',
    description: 'Leading accident replacement vehicle provider in Australia and New Zealand',
    sector: 'Consumer Services',
    investment: '2012',
    exit: '2016'
  },
  {
    name: 'Serenitas',
    id: 'serenitas',
    logo: 'https://thinkenergy.au/tasman/serenitas.png',
    type: 'Realised Investment',
    url: 'https://www.serenitas.com.au',
    description: 'A leading operator and developer of over-50s lifestyle communities',
    sector: 'Residential Land Lease Communities',
    investment: '2018',
    exit: '2024'
  },
  {
    name: 'Tasman Serenitas Continuation Fund',
    id: 'tasman-serenitas-continuation-fund',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Tasman Serenitas Continuation Fund.png',
    type: 'Current Investment',
    url: 'https://serenitas.com.au/',
    description: 'A GP-led single asset continuation invested in the Serenitas business alongside Pacific Equity Partners SAF II & Mirvac (ASX.MGR)',
    sector: 'Residential Land Lease Communities',
    investment: '2024'
  },
  {
    name: 'Tasman Holiday Parks',
    id: 'tasman-holiday-parks',
    logo: 'https://thinkenergy.au/tasman/pastdeals/tasman_holiday_park.webp',
    type: 'Current Investment',
    url: 'https://tasmanholidayparks.com.au',
    description: 'Leading manager of holiday park assets in Australia and New Zealand',
    sector: 'Tourism',
    investment: '2019'
  },
  {
    name: 'Tasman Lifestyle Continuum',
    id: 'tasman-lifestyle-continuum',
    logo: 'https://thinkenergy.au/tasman/pastdeals/Tas+LCG.png',
    type: 'Realised Investment',
    url: 'https://www.gatewaycorp.com.au/',
    description: 'Residential land lease community operator in Australia',
    sector: 'Residential Land Lease Communities',
    investment: '2011',
    exit: '2015'
  },
  {
    name: 'Tempo',
    id: 'tempo',
    logo: 'https://thinkenergy.au/tasman/pastdeals/temp.png',
    type: 'Realised Investment',
    url: 'https://www.tempoaust.com',
    description: 'Australia\'s second largest security business',
    sector: 'Services',
    investment: '2004',
    exit: '2006'
  }
];

const Investments = () => {
  const [sortBy, setSortBy] = React.useState<'year' | 'name' | 'exit'>('year');
  const [filterType, setFilterType] = React.useState<'all' | 'current' | 'realised'>('all');
  
  React.useEffect(() => {
    // Scroll to investment if hash is present
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      const header = document.querySelector('nav');
      if (element) {
        const headerHeight = header?.offsetHeight || 0;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - headerHeight - 24, // 24px extra padding
          behavior: 'smooth'
        });
      }
    }
  }, []);
  
  const sortedInvestments = React.useMemo(() => {
    // First filter by type
    let filtered = [...investments];
    if (filterType !== 'all') {
      const isCurrentType = filterType === 'current';
      filtered = filtered.filter(inv => 
        isCurrentType ? inv.type === 'Current Investment' : inv.type === 'Realised Investment'
      );
    }

    // Then sort
    if (sortBy === 'year') {
      return filtered.sort((a, b) => {
        const yearA = parseInt(a.investment || '0');
        const yearB = parseInt(b.investment || '0');
        return yearB - yearA; // Most recent first
      });
    } else if (sortBy === 'exit') {
      return filtered.sort((a, b) => {
        // Put non-exited (current) investments at the end
        if (!a.exit && !b.exit) return 0;
        if (!a.exit) return 1;
        if (!b.exit) return -1;
        // Parse exit years as integers
        const exitYearA = parseInt(a.exit);
        const exitYearB = parseInt(b.exit);
        return exitYearB - exitYearA; // Most recent exits first
      });
    } else {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [sortBy, filterType]);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="https://thinkenergy.au/tasman/sydney_tasman_capital_header.jpeg"
              alt="Sydney Tasman Capital"
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
              className="text-center mb-8 pt-24"
            >
              <h1 className="heading-xl mb-6">Investment Portfolio</h1>
              <p className="description-text max-w-3xl mx-auto">
                Our portfolio represents a diverse range of successful investments across multiple sectors, 
                demonstrating our ability to create value through strategic partnerships and operational excellence.
              </p>
            </motion.div>
          </div>
        </div>

        <section className="py-8">
          <div className="container-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Filter:</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filterType === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('current')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filterType === 'current'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setFilterType('realised')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        filterType === 'realised'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      Realised
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-0 sm:ml-8">
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Sort by:</h2>
                  <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('year')}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-initial ${
                    sortBy === 'year'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Recent</span>
                </button>
                <button
                  onClick={() => setSortBy('exit')}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-initial ${
                    sortBy === 'exit'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Exit Date</span>
                </button>
                <button
                  onClick={() => setSortBy('name')}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1 sm:flex-initial ${
                    sortBy === 'name'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="font-medium">A to Z</span>
                </button>
                </div>
              </div>
            </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedInvestments.map((investment, index) => (
                <motion.div
                  key={investment.name}
                  id={investment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative h-full perspective-[2000px]"
                >
                  <div className="relative h-full w-full transition-all duration-700 transform-style-3d group-hover:rotate-y-12 group-hover:rotate-x-12 group-hover:translate-y-[-8px]">
                    <div className="h-full rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 overflow-hidden flex flex-col">
                      <div className="relative h-[160px] overflow-hidden">
                        <div className="absolute inset-0 p-4 flex items-center justify-center">
                          <img
                            src={investment.logo}
                            alt={investment.name}
                            className="max-w-[200px] max-h-[100px] w-auto h-auto object-contain"
                          />
                        </div>
                      </div>

                      <div className="relative z-10 p-8">
                        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${
                          investment.type === 'Current Investment'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {investment.type}
                        </span>

                        <h3 className="text-xl font-medium mb-3 text-zinc-900 dark:text-white">
                          {investment.name}
                        </h3>
                        
                        <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                          {investment.description}
                        </p>
                        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                          <p className="border-b border-zinc-100 dark:border-white/10 py-2">
                            <span>Sector: {investment.sector}</span>
                          </p>
                          <p className="border-b border-zinc-100 dark:border-white/10 py-2">
                            <span>Investment: {investment.investment}</span>
                          </p>
                          {investment.exit && (
                            <p className="border-b border-zinc-100 dark:border-white/10 py-2">
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400 italic text-center">
            *NB: A number of the above transactions were completed by Tasman's partners whilst employed at previous firms
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Investments;