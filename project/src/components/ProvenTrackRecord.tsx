import { motion } from 'framer-motion';

const ProvenTrackRecord = () => {
  const stats = [
    { value: '$1.3bn', label: 'Proceeds Realised' },
    { value: '21+', label: 'Investments' },
    { value: '100+', label: 'Bolt-on Deals' },
    { value: '25+', label: 'Years Experience' },
  ];

  return (
    <section 
      className="section-padding relative overflow-hidden"
      data-sb-object-id="provenTrackRecord"
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
            data-sb-field-path="title"
          >
            <div className="relative inline-block">
              <span className="relative z-10 text-foreground">Proven Track Record</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
            <br />
            <div className="relative inline-block">
              <span className="relative z-10 text-foreground">of Excellence</span>
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent blur-2xl transform -skew-y-6"></div>
            </div>
          </h2>
          <p 
            className="description-text max-w-3xl mx-auto mb-8"
            data-sb-field-path="description"
          >
            Over 25 years of consistent outperformance in private equity management, with $1.3bn in 
            realised proceeds and a portfolio of successful strategic investments.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 group hover:bg-accent transition-all duration-500 text-center"
              data-sb-field-path={`stats.${index}`}
            >
              <div className="relative z-10">
                <motion.h3
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="text-4xl font-light mb-2 text-foreground"
                  data-sb-field-path="value"
                >
                  {stat.value}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-sm text-muted-foreground"
                  data-sb-field-path="label"
                >
                  {stat.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProvenTrackRecord;