import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SoftwareIllustration, FrontendIllustration, MobileIllustration } from './ServicesIllustrations';
import './Services.css';
import { BinaryBackground } from './BinaryBackground';

const expertise = [
  {
    title: 'Software Development',
    description: 'Design and build scalable, secure, and high-performance web applications from idea to production.',
    technologies: ['Dart', 'Python', 'Java', 'TypeScript'],
    Illustration: SoftwareIllustration,
  },
  {
    title: 'Frontend Development',
    description: 'Craft modern, responsive, and interactive user interfaces with a focus on performance and great UX.',
    technologies: ['React', 'Next.js', 'JavaScript', 'Tailwind CSS'],
    Illustration: FrontendIllustration,
  },
  {
    title: 'Mobile Development',
    description: 'Develop cross-platform mobile apps with polished UI, strong usability, and reliable performance.',
    technologies: ['React Native', 'JavaScript', 'Android', 'iOS'],
    Illustration: MobileIllustration,
  },
];

export function Services() {
  return (
    <section id="expertise" className="binary-surface expertise-section" aria-labelledby="expertise-heading">
      <BinaryBackground section="expertise" />
      <div className="expertise-container">
        <header className="expertise-header">
          <div>
            <p className="expertise-eyebrow"><span>/</span> EXPERTISE</p>
            <h2 id="expertise-heading">What We <span>Do</span></h2>
            <p className="expertise-subtitle">Building digital products from interface to implementation.</p>
          </div>
          <div className="expertise-note" aria-hidden="true">
            <span>IDEAS</span><span>CODE</span><span>REAL IMPACT</span>
          </div>
        </header>

        <div className="expertise-grid">
          {expertise.map(({ title, description, technologies, Illustration }, index) => (
            <a className="expertise-card" href="#projects" key={title} aria-label={`View ${title.toLowerCase()} work`}>
              <div className="expertise-card-top">
                <span className="expertise-number">0{index + 1}</span>
                <span className="expertise-card-arrow" aria-hidden="true"><ArrowUpRight size={21} strokeWidth={1.5} /></span>
              </div>
              <div className="expertise-art" aria-hidden="true"><Illustration /></div>
              <h3>{title}</h3>
              <p className="expertise-description">{description}</p>
              <ul className="expertise-technologies" aria-label="Technologies">
                {technologies.map(technology => <li key={technology}>{technology}</li>)}
              </ul>
              <span className="expertise-action">View work <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
