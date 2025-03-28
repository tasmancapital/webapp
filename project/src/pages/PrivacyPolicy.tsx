import * as React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { getContent, annotateContent } from '../lib/contentLoader';

interface PolicySection {
  title: string;
  content: string;
}

interface PrivacyPolicyContent {
  type: string;
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

const PrivacyPolicy = () => {
  // Get the privacy policy content
  const content = getContent<PrivacyPolicyContent>('privacy-policy');
  
  return (
    <div {...annotateContent('privacy-policy')} className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        <div className="container-xl py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-zinc dark:prose-invert max-w-4xl mx-auto"
          >
            <h1 
              className="text-3xl font-light tracking-tight mb-8"
              data-sb-field-path="title"
            >
              {content.title}
            </h1>
            
            <p 
              className="text-muted-foreground mb-8"
              data-sb-field-path="lastUpdated"
            >
              Last updated: {content.lastUpdated}
            </p>

            {content.sections.map((section, index) => (
              <section 
                key={index} 
                className="mb-12"
                data-sb-field-path={`.sections.${index}`}
              >
                <h2 
                  className="text-xl font-semibold mb-4"
                  data-sb-field-path=".title"
                >
                  {section.title}
                </h2>
                <p 
                  className="text-muted-foreground"
                  data-sb-field-path=".content"
                >
                  {section.content}
                </p>
              </section>
            ))}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;