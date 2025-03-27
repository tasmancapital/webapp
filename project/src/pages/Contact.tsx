import React from 'react';
import { Mail, Send, Building } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useContactForm } from '../hooks/useContactForm';

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

  return (
    <div 
      className="min-h-screen bg-background"
      data-sb-object-id="contactPage"
    >
      <Navbar />
      
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <img
                src="https://thinkenergy.au/tasman/tasman_capital_contact.JPG"
                alt="Tasman Capital Contact"
                className="absolute top-1/2 left-1/2 w-full h-full object-cover object-center -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                data-sb-field-path="heroImage"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/15 to-background/5"></div>
          </div>
        </div>

        <div className="relative z-10 bg-gradient-to-b from-background via-background to-transparent -mt-32 pb-32">
          <div className="container-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-4 pt-24"
            >
              <h1 
                className="heading-xl mb-4"
                data-sb-field-path="title"
              >
                Contact Us
              </h1>
              <p 
                className="description-text max-w-3xl mx-auto"
                data-sb-field-path="description"
              >
                Please contact our team
              </p>
            </motion.div>
          </div>
        </div>

        <section 
          className="py-8 md:py-12"
          data-sb-field-path="contactSection"
        >
          <div className="container-xl">
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Contact Form */}
                <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-zinc-50/80 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 p-6 lg:p-8 group hover:bg-zinc-100/80 dark:hover:bg-white/10 transition-all duration-500 lg:col-span-3"
              data-sb-field-path="contactForm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/50 dark:from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <h2 
                  className="text-xl font-semibold text-zinc-800 dark:text-white mb-6"
                  data-sb-field-path="title"
                >
                  Investment Inquiries
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                        className="w-full px-4 py-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-white/10"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                        className="w-full px-4 py-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-white/10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
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
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 backdrop-blur-sm border border-zinc-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:focus:ring-white/20 text-zinc-900 dark:text-white placeholder-zinc-400 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-white/10"
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
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white/10 hover:bg-zinc-800 dark:hover:bg-white/20 rounded-lg transition-all duration-300 text-white relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-700/50 dark:from-primary/20 via-zinc-800/30 dark:via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center gap-2">
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </button>
                </form>
              </div>
                </motion.div>

            <div 
              className="space-y-6"
              data-sb-field-path="contactInfo"
            >
              {/* Office Location */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
                data-sb-field-path="office"
              >
                <div className="flex items-start gap-4">
                  <Building className="w-6 h-6 text-zinc-400 mt-1" />
                  <div>
                    <h3 
                      className="text-lg font-semibold mb-2"
                      data-sb-field-path="title"
                    >
                      Sydney Office
                    </h3>
                    <p 
                      className="text-zinc-400 text-sm"
                      data-sb-field-path="address"
                    >
                      3603/60 Margaret St<br />
                      Sydney NSW 2000<br />
                      Australia
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
                data-sb-field-path="email"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-zinc-400" />
                    <div>
                      <div className="text-sm text-zinc-400">Email</div>
                      <a 
                        href="mailto:enquiries@tasmancapital.com.au" 
                        className="hover:text-zinc-300 transition-colors"
                        data-sb-field-path="address"
                      >
                        enquiries@tasmancapital.com.au
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            </div>

            {/* Maritime Image - Full Width */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
              data-sb-field-path="maritimeImage"
            >
              {/* Maritime Image */}
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
                <img
                  src="https://thinkenergy.au/tasman/tasman-capital-ship.jpg"
                  alt="Historical Maritime Scene"
                  className="w-full h-full object-cover sepia brightness-[0.95] contrast-[1.05] scale-[1.02]"
                  data-sb-field-path="image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <p 
                    className="text-sm font-light italic text-white"
                    data-sb-field-path="quote"
                  >
                    "Like Abel Tasman's pioneering voyages of the 17th century, we navigate the waters of opportunity across Australia and New Zealand."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;