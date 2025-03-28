import { motion } from 'framer-motion';
import { getContent, annotateContent } from '../lib/contentLoader';

interface Stat {
  value: string;
  label: string;
}

interface ProvenTrackRecordProps {
  heading?: string;
  subheading?: string;
  stats?: Stat[];
  content?: string;
}

interface ProvenTrackRecordContent {
  type: string;
  heading: string;
  subheading: string;
  stats: Stat[];
  content: string;
}

const ProvenTrackRecord = (props: ProvenTrackRecordProps = {}) => {
  // Get content from the JSON file
  const content = getContent<ProvenTrackRecordContent>('components/proven-track-record-section');
  
  // Use props if provided, otherwise use content from JSON
  const heading = props.heading || content.heading || 'Proven Track Record';
  const subheading = props.subheading || content.subheading;
  const stats = props.stats || content.stats || [
    { value: '$1.3bn', label: 'Proceeds Realised' },
    { value: '21+', label: 'Investments' },
    { value: '100+', label: 'Bolt-on Deals' },
    { value: '25+', label: 'Years Experience' },
  ];
  const description = props.content || content.content;

  return (
    <section 
      className="section-padding relative overflow-hidden"
      {...annotateContent('components/proven-track-record-section')}
    >
      <div className="absolute inset-0 bg-background"></div>
      
      <div className="container-xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] font-light tracking-tight leading-[1.1] mb-4 md:mb-6"
            data-sb-field-path="heading"
          >
            <div className="relative inline-block">
              <span className="relative z-10 text-foreground">{heading}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
          </h2>
          <p 
            className="description-text max-w-3xl mx-auto mb-8"
            data-sb-field-path="subheading"
          >
            {subheading || 'Over 25 years of consistent outperformance in private equity management, with $1.3bn in realised proceeds and a portfolio of successful strategic investments.'}
          </p>
          {description && (
            <p 
              className="description-text max-w-3xl mx-auto mb-8"
              data-sb-field-path="content"
            >
              {description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat: Stat, index: number) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary/30 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center justify-center text-center"
              data-sb-field-path={`stats.${index}`}
            >
              <div 
                className="text-3xl md:text-4xl font-medium mb-2 text-primary"
                data-sb-field-path=".value"
              >
                {stat.value}
              </div>
              <div 
                className="text-sm md:text-base text-foreground/80"
                data-sb-field-path=".label"
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvenTrackRecord;