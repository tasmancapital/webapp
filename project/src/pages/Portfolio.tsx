import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Building2, TrendingUp, Target } from 'lucide-react';

interface CaseStudyStep {
  title: string;
  description: string;
}

interface CaseStudy {
  name: string;
  type: string;
  year: string;
  exit?: string;
  irr: string;
  multiple: string;
  icon: any;
  color: string;
  steps: CaseStudyStep[];
}

const caseStudies: CaseStudy[] = [
  {
    name: 'Healthcare Australia',
    type: 'Market Entry & Aggregation',
    year: '2004',
    exit: '2006',
    irr: '67%',
    multiple: '2.0x',
    icon: Building2,
    color: 'from-blue-500/20 to-transparent',
    steps: [
      {
        title: 'Background',
        description: 'The nursing and homecare sectors were attractive in Australia due to ageing demographics, increasing demand for healthcare, casualisation of the nursing workforce and the increasing demand for at-home nurses. Rob Nichols identified the sector following review of recent activity within the US private equity market.'
      },
      {
        title: 'Origination and Investment',
        description: 'A strategy of building a platform with geographic and acuity diversity was developed to maximize retention of traveller nurses and cover various sub-specialties. Boutique advisors were appointed, and target companies\' brands were retained due to patient aversion to corporate "for-profit" medical care.'
      },
      {
        title: 'Principal\'s Value Add',
        description: 'Sophisticated transaction structures were employed with vendor notes and nurse equity rollover. Recruited a successful IT executive as CEO and acquired initial business with systems for platform strategy. Completed and integrated 10 acquisitions across multiple geographies and specialties.'
      },
      {
        title: 'Business Performance',
        description: 'The business quickly grew scale with revenues exceeding $50m and a diversified geographic footprint. Business became and remains the dominant market leader in Australia.'
      },
      {
        title: 'Exit',
        description: 'Sold to CHAMP PE in a secondary transaction following a dual track IPO and trade sale process. Achieved IRR of 67% and 2.0x MM. Renamed to Healthcare Australia by CHAMP PE. Won AIC (formerly AVCAL) MBO of the year 2006.'
      }
    ]
  },
  {
    name: 'Loscam',
    type: 'Secondary Management Buyout',
    year: '2003',
    exit: '2005',
    irr: '105%',
    multiple: '4.5x',
    icon: Building2,
    color: 'from-red-500/20 to-transparent',
    steps: [
      {
        title: 'Background',
        description: 'Leading returnable packaging business operating in Australia (20% market share), Thailand (80% market share), Malaysia (50% market share), Indonesia (100% market share), Hong Kong (70% market share) and Singapore (70% market share)'
      },
      {
        title: 'Investment Strategy',
        description: 'Sourced through auction process run by Credit Suisse. Largest management buyout in Australia at the time.'
      },
      {
        title: 'Value Creation',
        description: 'Consolidated and up-skilled Asian management team, allowing for aggressive growth in Malaysia and Thailand. Heavy investment in PP&E, modernizing facilities.'
      },
      {
        title: 'Exit',
        description: 'Sold to Affinity Private Equity following dual track IPO/trade sale process. Sale at EV of $252m delivering IRR of 105%, 4.5x MM.'
      }
    ]
  },
  {
    name: 'Right2Drive',
    type: 'Formation & Expansion',
    year: '2012',
    exit: '2016',
    irr: '227%',
    multiple: '3.1x',
    icon: Building2,
    color: 'from-blue-500/20 to-transparent',
    steps: [
      {
        title: 'Background',
        description: 'The credit hire sector provides vehicles for motorists in accidents that are not-at-fault and deprived of the use of their primary vehicle. The sector is well-established in the United Kingdom, and is enshrined in common law principles protecting individuals from loss when not-at-fault.'
      },
      {
        title: 'Investment Strategy',
        description: 'Company was founded by Rob Nichols and other business associates in 2012 with seed funding provided by HNW associates of Tasman. Capital raising process was run in 2015 by Tasman, with investment received from RGT Capital (Adam Wilson), a Sydney based multi family office.'
      },
      {
        title: 'Value Creation',
        description: 'Tasman recruited and installed the entire management team. Provided operational and strategic oversight of KMP delivery of Right2Drive\'s business plan. Initiated contact with potential buyers in first 6 months of operation and developed buyer interest through hold period. Raised working capital facility from domestic bank.'
      },
      {
        title: 'Business Performance',
        description: 'Right2Drive was one of Australia\'s highest growth companies and was recognized in the 2015 BRW Fast Starters, a list of the top 100 fastest growing companies and was a finalist in the 2016 Australian Growth Company Awards for fastest growing company.'
      },
      {
        title: 'Exit',
        description: 'Company was sold to Eclipx Ltd in 2016, delivering an IRR of 227%, 3.1x MM. Finalist for 2016 Exit of the year at the AVCAL Australian Growth Company Awards.'
      }
    ]
  },
  {
    name: 'Lifestyle Continuum Group',
    type: 'Market Entry & Roll-up',
    year: '2011',
    exit: '2015',
    irr: '129%',
    multiple: '3.0x',
    icon: Target,
    color: 'from-emerald-500/20 to-transparent',
    steps: [
      {
        title: 'Background',
        description: 'Market entry opportunity in highly fragmented manufactured housing estate sector, starting with acquisition of Lakeland.'
      },
      {
        title: 'Investment Strategy',
        description: 'Strong operational results induced $20m institutional investment from RGT Capital to begin sector roll-up.'
      },
      {
        title: 'Value Creation',
        description: 'Acquired and integrated 11 RLLCs in 9 months, becoming 3rd largest pure RLLC operator in Australia.'
      },
      {
        title: 'Exit',
        description: 'Merged and listed on ASX with Gateway Lifestyle Group. 129% IRR and 3.0x MM over 14-month period.'
      }
    ]
  }
];

const Portfolio = () => {
  const [activeCase, setActiveCase] = React.useState<CaseStudy>(caseStudies[0]);
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      
      <main className="pt-24">
        <div className="container-xl py-16 space-y-24">
          <div className="text-center">
            <h1 className="heading-lg mb-6">Our Portfolio</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
              Explore our track record of successful investments and value creation strategies.
            </p>
          </div>

          {/* Case Study Navigation */}
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <motion.button
                key={study.name}
                onClick={() => {
                  setActiveCase(study);
                  setActiveStep(0);
                }}
                className={`glass-card p-8 text-left transition-all duration-300 ${
                  activeCase.name === study.name ? 'ring-2 ring-zinc-900/20 dark:ring-white/20' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative z-10">
                  <study.icon className="w-8 h-8 mb-4" />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{study.name}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{study.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">Investment: {study.year}</div>
                      {study.exit && (
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">Exit: {study.exit}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">IRR</div>
                      <div className="text-xl font-semibold">{study.irr}</div>
                    </div>
                    <div>
                      <div className="text-sm text-zinc-400 mb-1">Multiple</div>
                      <div className="text-xl font-semibold">{study.multiple}</div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Case Study Details */}
          <div className="glass-card p-8 md:p-12">
            <div className="glass-card-hover" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold">{activeCase.name}</h2>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>{activeStep + 1}</span>
                  <span>/</span>
                  <span>{activeCase.steps.length}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {activeCase.steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                      activeStep === index ? 'ring-2 ring-white/20' : ''
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="glass-card-hover" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{step.title}</h3>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-8 glass-card">
                <div className="glass-card-hover" />
                <div className="relative z-10">
                  <motion.p
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg text-zinc-300"
                  >
                    {activeCase.steps[activeStep].description}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};


export default Portfolio;