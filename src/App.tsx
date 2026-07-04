import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingInquiry } from './components/FloatingInquiry';
import { Gallery } from './components/Gallery';
import { Hero } from './components/Hero';
import { Milestones } from './components/Milestones';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { SplashScreen } from './components/SplashScreen';
import { Team } from './components/Team';
import TargetCursor from './components/TargetCursor';

export default function App() {
  const reduce = useReducedMotion();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    document.body.style.overflow = showSplash ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence>{showSplash ? <SplashScreen onComplete={() => setShowSplash(false)} /> : null}</AnimatePresence>
      <TargetCursor targetSelector="a, button, .cursor-target" spinDuration={2} hideDefaultCursor parallaxOn cursorColor="#00FF41" cursorColorOnTarget="#7CFF7C" />
      <motion.div initial={reduce ? false : { opacity: 0 }} animate={showSplash ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Projects />
          <Team />
          <Gallery />
          <Milestones />
          <Contact />
        </main>
        <Footer />
        {!showSplash ? <FloatingInquiry /> : null}
      </motion.div>
    </div>
  );
}
