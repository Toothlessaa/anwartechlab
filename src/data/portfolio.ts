import { Code2, Globe2, Layers3, Rocket, ShieldCheck, Smartphone, TestTube2, Users, Wrench } from 'lucide-react';
import lawofficeImage from '../assets/lawoffice.png';
import successImage from '../assets/success.png';
import venueImage from '../assets/venueproject.png';

export const navItems = ['Home', 'Expertise', 'Work', 'Experience', 'Contact'];

export const services = [
  { title: 'Software Development', icon: Globe2, description: 'Experienced in both functional and OOP: Dart, Python, Java, JavaScript, TypeScript.' },
  { title: 'Frontend Dev. React, NextJS', icon: Code2, description: 'Passionate about UI/UX. Years of development experience in HTML, CSS, JS, React and NextJS frameworks.' },
  { title: 'Flutter Dev. Android, iOS', icon: Smartphone, description: 'Skilled in developing hybrid mobile apps and cross-platform solutions using the Flutter framework.' },
];

export const projects = [
  {
    title: 'PrimeSmile Dental',
    category: 'Web Development',
    filter: 'Web Development',
    description: 'Modern dental clinic website with online appointment booking and responsive patient experience.',
    tech: ['React', 'Booking System', 'Responsive'],
    image: 'https://picsum.photos/seed/primesmile-dental/900/640',
    size: 'medium',
    link: '#'
  },
  {
    title: 'Venue Hotel',
    category: 'Web Development',
    filter: 'Web Development',
    description: 'Luxury hotel website featuring room showcase, booking system, and immersive user experience.',
    tech: ['React', 'Hotel Booking', 'UI/UX'],
    image: venueImage,
    size: 'featured',
    link: 'https://venueweb.netlify.app/'
  },
  {
    title: 'Law Office Website',
    category: 'Web Development',
    filter: 'Web Development',
    description: 'Professional law firm website designed to establish credibility and simplify client inquiries.',
    tech: ['React', 'Corporate', 'Responsive'],
    image: lawofficeImage,
    size: 'wide',
    link: 'https://attyrafaelsantos.netlify.app/'
  },
  {
    title: 'Success Partnership Program',
    category: 'Web Development',
    filter: 'Web Development',
    description: 'Business partnership platform designed to present opportunities and attract potential partners.',
    tech: ['React', 'Business', 'Landing Page'],
    image: successImage,
    size: 'medium',
    link: 'https://successpartnership.netlify.app/'
  },

 
];

export const members = [
  { role: 'Founder / Project Lead', skills: ['Strategy', 'Delivery', 'Client Systems'] },
  { role: 'Frontend Developer', skills: ['React', 'Tailwind', 'Motion'] },
  { role: 'Backend Developer', skills: ['APIs', 'Databases', 'Security'] },
  { role: 'UI/UX Designer', skills: ['Product Design', 'Prototypes', 'Systems'] },
  { role: 'Mobile App Developer', skills: ['React Native', 'App Flows', 'Launches'] },
];

export const processSteps = [
  { title: 'Discover', icon: Users, text: 'We define goals, user flows, constraints, and the fastest path to a useful first release.' },
  { title: 'Design', icon: Layers3, text: 'We turn the plan into a visual direction, product map, and clickable interface blueprint.' },
  { title: 'Develop', icon: Code2, text: 'We build reusable frontend, backend, database, and admin modules with maintainable code.' },
  { title: 'Test', icon: TestTube2, text: 'We validate flows, responsive states, permissions, errors, and launch-critical interactions.' },
  { title: 'Launch', icon: Rocket, text: 'We deploy the system, connect production services, and prepare the project for real users.' },
  { title: 'Support', icon: Wrench, text: 'We keep improving the product with fixes, refinements, integrations, and new modules.' },
];

export const milestones = [
  { title: 'Senior Lead Software Engineer @ Solomon Global Ltd', text: 'Lead engineering work across production web applications and design systems.' },
  { title: 'Web Developer @ influenceTHIS Canada', text: 'Built responsive marketing and product interfaces for fast-moving teams.' },
  { title: 'Top Rated Web Developer @ Upwork Inc.', text: 'Delivered freelance web projects with consistent client communication.' },
];

export const testimonials = [
  { name: 'Mara Chen', role: 'Operations Lead', quote: 'The team translated a messy internal process into a clean dashboard our staff could actually use.' },
  { name: 'Jon Bell', role: 'Startup Founder', quote: 'They helped us launch our MVP quickly while keeping the product polished enough for early customers.' },
  { name: 'Ari Santos', role: 'Business Owner', quote: 'Communication was clear, the interface looked premium, and the final system saved us hours each week.' },
];

export const contactLinks = ['Email', 'Messenger', 'Facebook', 'GitHub', 'LinkedIn'];

export const CheckIcon = ShieldCheck;
