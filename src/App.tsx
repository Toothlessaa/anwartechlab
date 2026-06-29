import { motion, useReducedMotion } from 'framer-motion';
import { BackToTop } from './components/BackToTop';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Milestones } from './components/Milestones';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import TargetCursor from './components/TargetCursor';

export default function App() {
  const reduce = useReducedMotion();
  return (
    <motion.div className="min-h-screen overflow-hidden" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <TargetCursor targetSelector="a, button, .cursor-target" spinDuration={2} hideDefaultCursor parallaxOn cursorColor="#ffffff" cursorColorOnTarget="#5EE7FF" />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Milestones />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </motion.div>
  );
}
