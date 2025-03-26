import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Search, Presentation, Users, Calculator, FileSearch, CheckCircle, TrendingUp, LogOut } from 'lucide-react';
import { Carousel } from '../components/ui/apple-cards-carousel';

const Approach = () => {
  const cards = [
    {
      category: 'Phase 1',
      icon: Search,
      title: 'Deal Sourcing',
      description: 'Our proprietary deal generation process leverages extensive networks and relationships.',
      points: [
        'Proprietary deal generation',
        'Extensive networks including former management teams',
        'Less prominent sources through boutique advisory',
        'Selective participation in auctions'
      ],
      image: 'photo-1554469384-e58fac16e23a'
    },
    {
      category: 'Phase 2',
      icon: Presentation,
      title: 'Investment Screening',
      description: 'Rigorous screening process to identify the most promising opportunities.',
      points: [
        'All investments are robustly screened',
        'Continual review and prioritisation of pipeline',
        'Simultaneous evaluation of multiple investments',
        'Initial market and competitive analysis'
      ],
      image: 'photo-1460925895917-afdab827c52f'
    },
    {
      category: 'Phase 3',
      icon: Users,
      title: 'Deal Initiation',
      description: 'Structured approach to transaction negotiation and preliminary due diligence.',
      points: [
        'Lead partner negotiation',
        'Exclusivity sought for proprietary transactions',
        'Non-binding indicative offers',
        'Initial exit plans development'
      ],
      image: 'photo-1486406146926-c627a92ad1ab'
    },
    {
      category: 'Phase 4',
      icon: Calculator,
      title: 'Cost Approval',
      description: 'Thorough evaluation process through our Investment Committee.',
      points: [
        'Presentation to investment committee',
        'Detailed financial analysis',
        'Competitive landscape assessment',
        'Unanimous committee approval required'
      ],
      image: 'photo-1507679799987-c73779587ccf'
    },
    {
      category: 'Phase 5',
      icon: FileSearch,
      title: 'Due Diligence',
      description: 'Comprehensive evaluation of all aspects of the potential investment.',
      points: [
        'Appointment of key advisors',
        'Extensive market research',
        'Detailed site visits',
        'Management team assessment'
      ],
      image: 'photo-1454165804606-c3d57bc86b40'
    },
    {
      category: 'Phase 6',
      icon: CheckCircle,
      title: 'Investment Committee Approval',
      description: 'Final review and documentation of the investment decision.',
      points: [
        'Final offer submission',
        'Complete documentation review',
        'Shareholder agreements',
        'Investment protection structures'
      ],
      image: 'photo-1579532537598-459ecdaf39cc'
    },
    {
      category: 'Phase 7',
      icon: TrendingUp,
      title: 'Managing the Investment',
      description: 'Active management and monitoring of portfolio companies.',
      points: [
        'Strategic plans implementation',
        'Regular board meetings',
        'Monthly performance tracking',
        'Operational involvement'
      ],
      image: 'photo-1460925895917-afdab827c52f'
    },
    {
      category: 'Phase 8',
      icon: LogOut,
      title: 'Exit',
      description: 'Strategic planning and execution of investment exits.',
      points: [
        'Trade sale and IPO preparation',
        'Continuous exit thesis review',
        'Market timing optimization',
        'Value maximization strategy'
      ],
      image: 'photo-1579532537598-459ecdaf39cc'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />
      
      <main className="pt-24">
        <section className="py-20">
          <div className="container-xl">
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="heading-lg mb-8"
              >
                Our Investment Process
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed"
              >
                Tasman is deeply committed to a disciplined investment process that delivers 
                proven returns for investors. Our systematic approach ensures thorough evaluation 
                and management of every investment opportunity.
              </motion.p>
            </div>
          </div>
        </section>

        <Carousel items={cards} />
      </main>

      <Footer />
    </div>
  );
};

export default Approach;