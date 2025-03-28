import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProvenTrackRecord from '../components/ProvenTrackRecord';
import PastInvestments from '../components/PastInvestments';
import Performance from '../components/Performance';
import LogoShowcase from '../components/LogoShowcase';
import Footer from '../components/Footer';
import { getContent, annotateContent } from '../lib/contentLoader';

interface HomeSection {
  type: string;
  heading?: string;
  subheading?: string;
  videoUrl?: string;
}

interface HomeContent {
  type: string;
  title: string;
  subtitle: string;
  heroVideo: string;
  sections: HomeSection[];
}

function Home() {
  // Get the home content
  const content: HomeContent = getContent('home');

  return (
    <div {...annotateContent('home')} className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero 
          heading={content.title}
          subheading={content.subtitle}
          videoUrl={content.heroVideo}
        />
        <ProvenTrackRecord />
        <PastInvestments />
        <Performance />
        <LogoShowcase />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
