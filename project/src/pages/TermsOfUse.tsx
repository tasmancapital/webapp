import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24">
        <div className="container-xl py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-zinc dark:prose-invert max-w-4xl mx-auto"
          >
            <h1 className="text-3xl font-light tracking-tight mb-8">Terms of Use</h1>
            
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-AU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                These Terms of Use govern your use of the website operated by Tasman Capital Pty Ltd (ACN 114 016 698) and its related bodies corporate ("Tasman Capital", "we", "our" or "us"). By accessing and using this website, you agree to be bound by these Terms of Use. If you do not agree to these terms, you must not use this website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">2. Not Financial Product Advice</h2>
              <p className="text-muted-foreground mb-4">
                The information provided on this website is general information only and does not constitute financial product advice. It has been prepared without taking into account your objectives, financial situation or needs. Before acting on any information on this website, you should consider its appropriateness to your circumstances and seek professional advice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">3. Investment Performance</h2>
              <p className="text-muted-foreground mb-4">
                Past performance information provided on this website is not a reliable indicator of future performance. No representation or warranty is made as to the reasonableness of the assumptions made or that all assumptions used have been stated. Actual results may vary from projections and such variations may be material.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                All intellectual property rights in this website and its contents (including text, graphics, logos, icons, sound recordings and software) are owned by or licensed to Tasman Capital. You may view this website and its contents for personal and non-commercial use only. You must not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">5. Third Party Links</h2>
              <p className="text-muted-foreground">
                This website may contain links to third party websites. These links are provided for convenience only and Tasman Capital does not endorse, approve or take responsibility for the content of any third party website or from any advertising, products or other materials on such websites.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Tasman Capital excludes all liability for any loss or damage of any kind (including special, indirect or consequential loss and including loss of business profits) arising out of or in connection with the website content and use of, or reliance on, such content.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">7. Privacy</h2>
              <p className="text-muted-foreground">
                Your use of this website is also subject to our Privacy Policy. Please review our Privacy Policy, which also governs the website and informs users of our data collection practices.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">8. Jurisdiction</h2>
              <p className="text-muted-foreground">
                These Terms of Use are governed by the laws of New South Wales, Australia. You irrevocably submit to the exclusive jurisdiction of the courts of New South Wales and courts of appeal from them.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website following the posting of changes constitutes your acceptance of those changes.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Use, please contact us at:
              </p>
              <div className="text-muted-foreground">
                <p>Tasman Capital Pty Ltd</p>
                <p>3603/60 Margaret St</p>
                <p>Sydney NSW 2000</p>
                <p>Email: info@tasmancapital.com.au</p>
                <p>Phone: +61 2 8999 1090</p>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfUse;