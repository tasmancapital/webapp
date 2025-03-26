import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-light tracking-tight mb-8">Privacy Policy</h1>
            
            <p className="text-muted-foreground mb-8">
              Last updated: {new Date().toLocaleDateString('en-AU', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                Tasman Capital Pty Ltd (ACN 114 016 698) and its related bodies corporate (we, our, us) maintain the privacy of your personal information and safeguard your privacy rights. This privacy policy outlines how we collect, hold, use and disclose your personal information.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Collection of Personal Information</h2>
              <p className="text-muted-foreground mb-4">
                We collect personal information that is reasonably necessary for our business functions and activities. This may include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Name, contact details and identification information</li>
                <li>Financial information and tax file numbers</li>
                <li>Information about your business or assets</li>
                <li>Professional qualifications and employment history</li>
                <li>Information from your use of our website</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Use of Personal Information</h2>
              <p className="text-muted-foreground mb-4">
                We use your personal information for purposes including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Providing our investment and advisory services</li>
                <li>Managing our relationship with you</li>
                <li>Conducting due diligence and compliance activities</li>
                <li>Marketing our services and events</li>
                <li>Meeting our legal and regulatory obligations</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Disclosure of Personal Information</h2>
              <p className="text-muted-foreground mb-4">
                We may disclose your personal information to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Our employees, contractors and related bodies corporate</li>
                <li>Professional advisers and service providers</li>
                <li>Regulatory bodies and government agencies</li>
                <li>Other parties with your consent</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Security of Personal Information</h2>
              <p className="text-muted-foreground">
                We take reasonable steps to protect your personal information from misuse, interference, loss, unauthorized access, modification or disclosure. We maintain physical, electronic and procedural safeguards and regularly review and update our security measures.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Access and Correction</h2>
              <p className="text-muted-foreground">
                You may request access to your personal information or ask us to correct information that is inaccurate, incomplete or out of date. To do so, please contact our Privacy Officer using the details below.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Complaints</h2>
              <p className="text-muted-foreground">
                If you have any concerns about how we handle your personal information, please contact our Privacy Officer. We will investigate your complaint and respond to you within a reasonable time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                For privacy-related queries, please contact our Privacy Officer:
              </p>
              <div className="text-muted-foreground">
                <p>Privacy Officer</p>
                <p>Tasman Capital Pty Ltd</p>
                <p>3603/60 Margaret St</p>
                <p>Sydney NSW 2000</p>
                <p>Email: privacy@tasmancapital.com.au</p>
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

export default PrivacyPolicy;