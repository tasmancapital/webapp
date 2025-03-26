import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { runMigrations } from './lib/migrations';
import Navbar from './components/Navbar';
import { useLayoutEffect } from 'react';
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
import Login from './pages/Login';
import Contact from './pages/Contact';
import TestPage from './pages/TestPage';
import NetlifyVisualEditing from './components/NetlifyVisualEditing';

function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Run migrations on app start
    runMigrations().catch(console.error);
  }, [location.pathname]);

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
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Add NetlifyVisualEditing component for visual editing capabilities */}
      <NetlifyVisualEditing />
    </>
  );
}

export default App;