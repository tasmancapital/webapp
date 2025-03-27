import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Team = () => {
  const [expandedMember, setExpandedMember] = React.useState<string | null>(null);

  const team = [
    {
      id: 'rob-nichols',
      name: 'Rob Nichols',
      role: 'Managing Partner',
      image: 'https://thinkenergy.au/tasman/team/1.jpg',
      summary: 'Rob co-founded Tasman Capital in 2008. Rob has over 20 years experience in private equity investment at Tasman, Nikko Principal Investments and Deutsche Bank Capital Partners. Rob has held executive roles including Executive Chairman, CEO and COO across various listed and private companies.',
      details: [
        'Rob has led or co-led 18 private equity transactions primarily in healthcare, business and industrial services including over 60 bolt-on transactions.',
        'During the past 15 years, Rob has founded or co-founded 5 businesses in various sectors.',
        'Rob previously worked for Bankers Trust in London and Deloitte in Sydney, Boston, Warsaw and London.',
        'Education: Bachelor of Business. Rob is a Chartered Accountant.'
      ]
    },
    {
      id: 'adam-wilson',
      name: 'Adam Wilson',
      role: 'Senior Partner',
      image: 'https://thinkenergy.au/tasman/team/2.jpg',
      summary: 'Adam has over 20 years experience in mergers and acquisitions and private equity investment at Tasman, RGT Capital and Greenhill.',
      details: [
        'Adam has led or co-led more than 10 private equity transactions in industrial services, financial services and food and beverage. Adam has held executive roles including CEO and COO across various private companies.',
        'Adam previously worked for Greenhill and KPMG in Sydney and London.',
        'Education: Masters of Finance and Bachelor of Business.'
      ]
    },
  
     {
      id: 'fiona-holyoake',
      name: 'Fiona Holyoake',
      role: 'Partner',
      image: 'https://thinkenergy.au/tasman/team/4.jpg',
      summary: 'Fiona has over 20 year\'s experience combining investment, dealmaking, and advisory with a focus on industry disruption.',
      details: [
        'Fiona has led and co led deals in private equity, venture and corporate acquisitions, in energy transition, circular economy, financial services, core plus infrastructure, and technology sectors in Asia, the USA, and Australia.',
        'Fiona has held Executive, Strategy and M&A roles at Deutsche Bank, Origin Energy and PwC Lead Advisory.',
        'She started her investment career at Deutsche Bank Capital Partners.',
        'Education: Masters of Business Administration, Masters of Applied Finance, Bachelor of Commerce. Fiona is a Chartered Accountant.'
      ]
    },
    {
      id: 'nathan-cleary',
      name: 'Nathan Cleary',
      role: 'Partner',
      image: 'https://thinkenergy.au/tasman/team/3.jpg',
      summary: 'Nathan has 20 years of private equity experience at Tasman, Nikko Principal Investments and Deutsche Bank Capital Partners.',
      details: [
        'Nathan has 6 years operational finance experience as CFO at Serenitas and previously as Finance Manager at Right2Drive. He also spent 21 months at Boral Limited in the Strategy and M&A team.',
        'Nathan started his career in the audit and assurance division (financial services) at PricewaterhouseCoopers.',
        'Education: Bachelor of Business. Nathan is a CPA and CFA Charterholder.'
      ]
    },
   
    {
      id: 'chris-davies',
      name: 'Chris Davies',
      role: 'Partner',
      image: 'https://thinkenergy.au/tasman/team/5.jpg',
      summary: 'Chris has over 10 years of private equity experience at Tasman, Nikko Principal Investments and Ironbridge. Chris re-joined Tasman in 2017.',
      details: [
        'Chris has held senior operational executive roles at Tasman Holiday Parks, Serenitas, Smart Group, Eclipx Ltd and Westpac.',
        'Chris commenced his professional career at Ernst & Young in corporate finance, audit and business services in Adelaide and New York.',
        'Education: Bachelor of Commerce. Chris is a Chartered Accountant.'
      ]
    },
    {
      id: 'victoria-rohrsheim',
      name: 'Victoria Rohrsheim',
      role: 'Head of Compliance',
      image: 'https://thinkenergy.au/tasman/team/6.jpg',
      summary: 'Victoria has 10 years experience in various operational finance, human resources and compliance roles in the financial services and healthcare sectors including CFO roles at both Tasman and Catalyst Investment Managers. She was also Financial Controller at Tasman Lifestyle Continuum.',
      details: [
        'Victoria has 7 years experience in direct private equity investing at Deutsche Bank Capital Partners and Propel Investments.',
        'Previously Victoria has worked for KPMG Corporate Finance in Sydney and Perth and Arthur Andersen in corporate recovery and contract financial services.',
        'Education: Bachelor of Commerce. Victoria is a Chartered Accountant.'
      ]
    },
    {
      id: 'david-fisher',
      name: 'David Fisher',
      role: 'CFO',
      image: 'https://thinkenergy.au/tasman/team/7.jpg',
      summary: 'David set up the finance functions for Serenitas, Tasman Lifestyle Continuum, and Tasman Holiday Parks, implementing back-office, financial, and reporting systems from inception. These roles were handed off to full-time CFOs as each respective business reached critical mass.',
      details: [
        'David has 19 years of experience in commerce with over a decade in investment banking, insolvency, and auditing with leading advisory firms and ASX-listed companies.',
        'David commenced his professional career at KPMG.',
        'Education: Bachelor of Economics, Grad Dip (Securities Institute of Australia), Grad Dip (Chartered Secretaries Australia). David is a Chartered Accountant.'
      ]
    },
    {
      id: 'brone-roze',
      name: 'Brone Roze',
      role: 'Investment Director',
      image: 'https://thinkenergy.au/tasman/team/8.jpg',
      summary: 'Brone has over 13 years experience in mergers & acquisitions, corporate development, private capital investment and senior finance roles across a broad range of sectors including property, online and technology sectors.',
      details: [
        'Brone has previously held roles including Investment Director for a private family office fund focused on commercial property and venture investments and as CFO of ASX listed SaaS business, Skyfii Ltd.',
        'Brone also worked in investment banking and mergers and acquisitions roles at KPMG Corporate Finance, ABN AMRO and Macquarie Bank.',
        'Education: Bachelor of Commerce, LLB, LLM.'
      ]
    },
    {
      id: 'max-peres',
      name: 'Max Peres',
      role: 'Vice President',
      image: 'https://thinkenergy.au/tasman/team/9.jpg',
      summary: 'Max joined Tasman Capital in 2019. Max has over 5 years of corporate finance and private equity experience.',
      details: [
        'Prior to Tasman, Max held a position in the corporate finance team at Shaw and Partners advising small and mid-cap ASX listed companies on M&A and ECM.',
        'Education: Bachelor of Commerce, Master of Finance, and is a CFA Charterholder.'
      ]
    },
    {
      id: 'alex-hardgreave',
      name: 'Alex Hardgreave',
      role: 'Assistant Vice President',
      image: 'https://thinkenergy.au/tasman/team/10.jpg',
      summary: 'Alex joined Tasman Capital in 2020. Alex has over 3 years of private equity experience in direct investing and capital raising.',
      details: [
        'Prior to joining Tasman, Alex worked at MVision Private Equity Advisers in London raising funds for alternate investment firms.',
        'Alex commenced his professional career with KPMG in Melbourne in 2017.',
        'Education: Bachelor of Commerce'
      ]
    },
    {
      id: 'daniel-flynn',
      name: 'Daniel Flynn',
      role: 'Investment Associate',
      image: 'https://thinkenergy.au/tasman/team/11.jpg',
      summary: 'Daniel joined Tasman Capital at the start of 2024. Daniel has over three years of investment banking and private equity experience.',
      details: [
        'Prior to joining Tasman Capital, Daniel worked at Goldman Sachs within the Real Estate, Leisure and Gaming M&A Team in London.',
        'Education: Bachelor of Commerce and MSc Finance & Accounting.'
      ]
    },
    {
      id: 'elizabeth-jackson',
      name: 'Elizabeth Jackson',
      role: 'Executive Assistant and Office Assistant',
      image: 'https://thinkenergy.au/tasman/team/12.jpg',
      summary: 'Elizabeth commenced her professional career in London and has previously held secretarial roles within aerospace, engineering and the medical sector',
      details: [
        'Education: Bachelor of Arts in English'
      ]
    }
  ];

  return (
    <div 
      className="min-h-screen bg-background"
      data-sb-object-id="teamPage"
    >
      <Navbar />
      <main>
        <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-1/2 left-1/2 w-[180%] h-[180%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 will-change-transform object-cover"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
                data-sb-field-path="heroVideo"
              >
                <source src="https://thinkenergy.au/tasman/tasman-capital.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/20"></div>
          </div>
        </div>

        <div className="relative z-10 bg-gradient-to-b from-background via-background to-transparent -mt-32 pb-32">
          <div className="container-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16 pt-32"
            >
              <h1 
                className="heading-xl mb-6"
                data-sb-field-path="title"
              >
                Our Team
              </h1>
              <p 
                className="description-text max-w-3xl mx-auto"
                data-sb-field-path="description"
              >
                Meet our experienced team of investment professionals dedicated to creating value 
                through strategic partnerships and operational excellence.
              </p>
            </motion.div>
          </div>
        </div>

        <div 
          className="container-xl pb-16"
          data-sb-field-path="teamMembers"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card group relative overflow-hidden"
                data-sb-field-path={`.${i}`}
              >
                {/* Card Content */}
                <div className="relative z-10 p-6">
                  <div className="mb-4 aspect-square overflow-hidden rounded-xl">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      data-sb-field-path="image"
                    />
                  </div>
                  <h3 
                    className="text-xl font-semibold mb-1"
                    data-sb-field-path="name"
                  >
                    {member.name}
                  </h3>
                  <p 
                    className="text-sm text-zinc-400 mb-3"
                    data-sb-field-path="role"
                  >
                    {member.role}
                  </p>
                  <p 
                    className="text-sm text-zinc-500 dark:text-zinc-400 mb-4"
                    data-sb-field-path="summary"
                  >
                    {member.summary}
                  </p>
                  <button
                    onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {expandedMember === member.id ? 'View Less' : 'View More'}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedMember === member.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 pb-6"
                    data-sb-field-path="details"
                  >
                    <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                      <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {member.details.map((detail, index) => (
                          <li 
                            key={index}
                            data-sb-field-path={`.${index}`}
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Team;