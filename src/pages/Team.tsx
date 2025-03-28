import * as React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { getContent, annotateContent } from '../lib/contentLoader';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  summary: string;
  details: string[];
}

interface TeamContent {
  heroVideo: string;
  title: string;
  description: string;
  teamMembers: TeamMember[];
}

function Team() {
  const [expandedMember, setExpandedMember] = React.useState<string | null>(null);
  
  // Get the team content
  const content: TeamContent = getContent('team');

  // Function to determine image class based on team member ID
  const getImageClass = (memberId: string) => {
    if (memberId === 'alex-hardgreave') {
      return "w-full aspect-[4/5] object-cover object-top scale-110"; // Alex's image slightly bigger
    } else if (memberId === 'daniel-flynn') {
      return "w-full aspect-[4/5] object-cover object-top scale-95"; // Daniel's image slightly smaller
    } else {
      return "w-full aspect-[4/5] object-cover object-top"; // Default for others
    }
  };

  // Handle card click
  const handleCardClick = (memberId: string) => {
    // If the clicked card is already expanded, close it
    // Otherwise, expand the clicked card and close any other expanded card
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div {...annotateContent('team')} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <div className="relative w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
                data-sb-field-path="heroVideo"
              >
                <source src={content.heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/15 to-background/5"></div>
            </div>
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
                className="description-text max-w-3xl mx-auto"
                data-sb-field-path="description"
              >
                {content.description}
              </p>
            </motion.div>
          </div>
        </div>
        
        <section className="py-16 px-4">
          <div 
            className="container-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            data-sb-field-path="teamMembers"
          >
            {content.teamMembers && content.teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                id={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-sb-field-path={`.${index}`}
                style={{ position: 'relative', zIndex: expandedMember === member.id ? 10 : 1 }}
              >
                <div className={`relative h-full bg-white rounded-md shadow-sm ${expandedMember === null || expandedMember === member.id ? 'border border-gray-100' : 'border-0'} overflow-hidden`}>
                  <div 
                    className="cursor-pointer overflow-hidden"
                    onClick={() => handleCardClick(member.id)}
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className={getImageClass(member.id)}
                      data-sb-field-path=".image"
                    />
                  </div>
                  
                  <div className="p-4 text-center">
                    <h3 
                      className="text-base font-semibold mb-1"
                      data-sb-field-path=".name"
                    >
                      {member.name}
                    </h3>
                    <p 
                      className="text-gray-500 text-sm"
                      data-sb-field-path=".role"
                    >
                      {member.role}
                    </p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {expandedMember === member.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 text-left"
                      >
                        <p 
                          className="text-gray-600 text-sm mb-4"
                          data-sb-field-path=".summary"
                        >
                          {member.summary}
                        </p>
                        <div
                          className="space-y-2 text-gray-600 text-sm"
                          data-sb-field-path=".details"
                        >
                          {member.details.map((detail, i) => (
                            <p 
                              key={i} 
                              className="mb-2"
                              data-sb-field-path={`.${i}`}
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Team;