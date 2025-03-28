import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Timeline from '../components/Timeline';
import Values from '../components/Values';
import { getContent, annotateContent } from '../lib/contentLoader';

interface AboutContent {
  title: string;
  description: string;
  heroImage: string;
  history: {
    title: string;
    description: string;
  };
}

function About() {
  // Get the about page content
  const content: AboutContent = getContent('about');
  
  return (
    <div {...annotateContent('about')} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={content.heroImage}
              alt="Tasman Capital About"
              className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
              data-sb-field-path="heroImage"
            />
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
                className="heading-xl mb-6"
                data-sb-field-path="title"
              >
                {content.title}
              </h1>
              <p 
                className="description-text max-w-5xl mx-auto px-4"
                data-sb-field-path="description"
              >
                {content.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* History Timeline */}
        <section 
          id="history" 
          className="pt-0 pb-8"
          data-sb-field-path="history"
        >
          <div className="container-xl">
            <div className="text-center mb-8">
              <h2 
                className="heading-lg mb-6"
                data-sb-field-path=".title"
              >
                {content.history.title}
              </h2>
              <p 
                className="description-text max-w-3xl mx-auto"
                data-sb-field-path=".description"
              >
                {content.history.description}
              </p>
            </div>
            <Timeline />
          </div>
        </section>

        {/* Values Section */}
        <Values />

      </main>
      <Footer />
    </div>
  );
}

export default About;