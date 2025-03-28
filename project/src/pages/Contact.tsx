import * as React from 'react';
import { Mail, Send, Building } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useContactForm } from '../hooks/useContactForm';
import { getContent, annotateContent } from '../lib/contentLoader';

interface ContactContent {
  type: string;
  title: string;
  description: string;
  heroImage: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  email: string;
}

const Contact = () => {
  const {
    values,
    errors,
    isSubmitting,
    isSuccess,
    errorMessage,
    handleChange,
    handleSubmit,
  } = useContactForm();
  
  // Get the contact content
  const content = getContent<ContactContent>('contact');

  return (
    <div 
      {...annotateContent('contact')}
      className="min-h-screen bg-background"
    >
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <img
                src={content.heroImage}
                alt="Tasman Capital Contact"
                className="absolute top-1/2 left-1/2 w-full h-full object-cover object-center -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70"
                data-sb-field-path="heroImage"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/20"></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 bg-background">
          <div className="container-xl px-4 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 
                className="text-4xl md:text-5xl font-light tracking-tight mb-6"
                data-sb-field-path="title"
              >
                {content.title}
              </h1>
              <p 
                className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
                data-sb-field-path="description"
              >
                {content.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative z-10 bg-gradient-to-b from-background to-background/95">
          <div className="container-xl px-4 py-8 md:py-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Contact Form Column */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-7"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl h-full">
                  <h2 className="text-2xl font-light text-foreground mb-6 pb-4 border-b border-white/10">
                    Investment Inquiries
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          <span className="flex items-center gap-2">
                            <span>Name</span>
                            {errors.name && <span className="text-red-400 text-xs">Required</span>}
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder-foreground/40 transition-all duration-300"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          <span className="flex items-center gap-2">
                            <span>Email</span>
                            {errors.email && <span className="text-red-400 text-xs">Required</span>}
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder-foreground/40 transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground/80 mb-2">
                        <span className="flex items-center gap-2">
                          <span>Message</span>
                          {errors.message && <span className="text-red-400 text-xs">Required</span>}
                        </span>
                      </label>
                      <textarea
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder-foreground/40 transition-all duration-300"
                        placeholder="Enter your message"
                      />
                    </div>
                    
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                      >
                        <p className="text-sm text-red-400">{errorMessage}</p>
                      </motion.div>
                    )}
                    
                    {isSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                      >
                        <p className="text-sm text-emerald-400">Message sent successfully!</p>
                      </motion.div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 rounded-lg transition-all duration-300 text-primary-foreground font-medium"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>
              </motion.div>
              
              {/* Contact Information Column */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-5 flex flex-col gap-6"
                data-sb-field-path="contactInfo"
              >
                {/* Office Location Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl flex-1">
                  <h3 className="text-2xl font-light text-foreground mb-6 pb-4 border-b border-white/10">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Office Address */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">Sydney Office</h4>
                        <p className="text-sm text-foreground/70">
                          {content.address.street}<br />
                          {content.address.city}, {content.address.state} {content.address.postcode}<br />
                          {content.address.country}
                        </p>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-base font-medium mb-1">Email</h4>
                        <a 
                          href={`mailto:${content.email}`}
                          className="text-sm text-foreground/70 hover:text-primary transition-colors"
                        >
                          {content.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Business Hours Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
                  <h3 className="text-2xl font-light text-foreground mb-6 pb-4 border-b border-white/10">
                    Business Hours
                  </h3>
                  <div className="space-y-4 text-foreground/70">
                    <div className="flex justify-between items-center">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Saturday - Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;