import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProvenTrackRecord from './components/ProvenTrackRecord';
import PastInvestments from './components/PastInvestments';
import Performance from './components/Performance';
import LogoShowcase from './components/LogoShowcase';
import Footer from './components/Footer';
import About from './pages/About';
import Investments from './pages/Investments';
import Team from './pages/Team';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import TestPage from './pages/TestPage';

function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // No longer need to run migrations since we're using SQLite
  
  return (
    <>
      <Routes>
        {/* Add catch-all route at the end */}
        <Route path="/" element={
          <div className="min-h-screen">
            <Navbar />
            <Hero />
            <ProvenTrackRecord />
            <PastInvestments />
            <Performance />
            <LogoShowcase />
            <Footer />
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/team" element={<Team />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;