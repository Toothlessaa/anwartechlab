import { Code2, Globe2, Layers3, Rocket, ShieldCheck, Smartphone, TestTube2, Users, Wrench } from 'lucide-react';
import { storageAsset } from '../lib/assets';

export const navItems = ['Home', 'Expertise', 'Work', 'Team', 'Experience', 'Contact'];

export const services = [
  { title: 'Software Development', icon: Globe2, description: 'Experienced in both functional and OOP: Dart, Python, Java, JavaScript, TypeScript.' },
  { title: 'Frontend Dev. React, NextJS', icon: Code2, description: 'Passionate about UI/UX. Years of development experience in HTML, CSS, JS, React and NextJS frameworks.' },
  { title: 'Flutter Dev. Android, iOS', icon: Smartphone, description: 'Skilled in developing hybrid mobile apps and cross-platform solutions using the Flutter framework.' },
];

export const projects = [
  {
    id: 'auralis-dental',
    title: 'Auralis Dental',
    category: 'Web Development',
    filter: 'Web',
    description: 'Dental clinic booking website with service discovery, appointment-focused flow, and polished patient experience.',
    story: 'A modern dental booking experience that helps patients understand services and request appointments quickly.',
    challenge: 'The clinic needed a credible website that could feel calm, professional, and easy to use for new patients.',
    solution: 'We built a refined dental landing page with clear services, direct booking prompts, and responsive visual presentation.',
    features: ['Dental service showcase', 'Appointment-focused CTAs', 'Responsive patient flow'],
    tech: ['React', 'Dental Website', 'Booking Flow', 'TailwindCSS'],
    image: storageAsset('projects/dental.png'),
    size: 'hero',
    link: 'https://dentalsbookingg.netlify.app/'
  },
  {
    id: 'car-rental',
    title: 'Car Rental Platform',
    category: 'Web Development',
    filter: 'Web',
    description: 'Modern car rental website with vehicle browsing, booking-focused flow, and responsive customer experience.',
    story: 'A fast rental experience designed to help customers browse vehicles and move toward booking with confidence.',
    challenge: 'The platform needed to present available vehicles clearly while keeping the rental flow simple on every device.',
    solution: 'We built a polished vehicle showcase with strong calls to action, clean sections, and a mobile-first booking path.',
    features: ['Vehicle showcase', 'Booking-focused CTAs', 'Responsive rental flow'],
    tech: ['React', 'Car Rental', 'Booking Flow', 'TailwindCSS'],
    image: storageAsset('projects/car.png'),
    size: 'medium',
    link: 'https://karrental.netlify.app/'
  },
  {
    id: 'venue-hotel',
    title: 'Venue Hotel',
    category: 'Web Development',
    filter: 'Web',
    description: 'Luxury hotel website featuring room showcase, booking system, and immersive user experience.',
    story: 'A premium venue and hotel experience built to present rooms, events, and bookings with a polished visual direction.',
    challenge: 'The project needed to feel high-end while still guiding visitors toward booking and venue discovery.',
    solution: 'We paired large visual previews with a direct browsing flow, strong calls to action, and an elegant responsive interface.',
    features: ['Luxury visual showcase', 'Booking-ready user flow', 'Room and venue presentation'],
    tech: ['React', 'Hotel Booking', 'UI/UX', 'TailwindCSS'],
    image: storageAsset('projects/venueproject.png'),
    size: 'hero',
    link: 'https://venueee.netlify.app/'
  },
  {
    id: 'hotel-de-susana',
    title: 'Hotel De Susana',
    category: 'Web Development',
    filter: 'Web',
    description: 'Premium hotel website presenting rooms, amenities, and guest-focused booking information.',
    story: 'A polished hospitality experience designed to make Hotel De Susana feel welcoming, credible, and easy to explore.',
    challenge: 'The hotel needed a clean digital presence that could highlight its spaces and guide visitors toward inquiries or bookings.',
    solution: 'We created a responsive hotel showcase with strong visuals, clear content hierarchy, and direct guest actions.',
    features: ['Hotel room showcase', 'Guest-focused content flow', 'Responsive booking-ready layout'],
    tech: ['React', 'Hotel Website', 'UI/UX', 'TailwindCSS'],
    image: storageAsset('projects/hotel.jpg'),
    size: 'medium',
    link: 'https://hotelwebbb.netlify.app/'
  },
  {
    id: 'law-office',
    title: 'Law Office Website',
    category: 'Web Development',
    filter: 'Web',
    description: 'Professional law firm website designed to establish credibility and simplify client inquiries.',
    story: 'A credibility-focused website for a law office that needed to feel professional, trustworthy, and direct.',
    challenge: 'Legal services require clear trust signals, readable information, and easy inquiry paths without visual clutter.',
    solution: 'We built a refined corporate interface with strong hierarchy, service clarity, and accessible contact actions.',
    features: ['Trust-focused service pages', 'Clear inquiry path', 'Professional responsive layout'],
    tech: ['React', 'Corporate', 'Responsive', 'Legal Website'],
    image: storageAsset('projects/lawoffice.png'),
    size: 'wide',
    link: 'https://attyrafaelsantos.netlify.app/'
  },
  {
    id: 'success-partnership',
    title: 'Success Partnership Program',
    category: 'Web Development',
    filter: 'SaaS',
    description: 'Business partnership platform designed to present opportunities and attract potential partners.',
    story: 'A business landing experience built to communicate opportunity, credibility, and partner value quickly.',
    challenge: 'The brand needed a landing page that could explain the program clearly and motivate partner interest.',
    solution: 'We designed a focused conversion page with strong messaging, structured sections, and direct action points.',
    features: ['Partner-focused messaging', 'Conversion landing page', 'Business opportunity flow'],
    tech: ['React', 'Business', 'Landing Page', 'SaaS'],
    image: storageAsset('projects/success.png'),
    size: 'medium',
    link: 'https://successpartnership.netlify.app/'
  },

 
];

export const members = [
  { name: 'Noel Blanco', role: 'CEO / Project Lead', skills: ['Strategy', 'Delivery', 'Client Systems'] },
  { name: 'Khalifa Blanco', role: 'QA Analyst / Project Planner', skills: ['Testing', 'Analysis', 'Planning'] },
  { name: 'Felbert Yarte', role: 'Backend Developer', skills: ['APIs', 'Databases', 'Security'] },
  { name: 'Jay Anne Lalanan', role: 'UI/UX Designer', skills: ['Product Design', 'Prototypes', 'User Flows'] },
  { name: 'Jean Robert Owen Pascua', role: 'Frontend Developer', skills: ['React', 'Tailwind', 'Responsive UI'] },
  { name: 'Ivar Hinisan', role: 'Frontend Developer', skills: ['React', 'UI Motion', 'Web Interfaces'] },
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
  { title: 'Startup-Speed Development', text: 'From idea to launch-ready product with clean, scalable code.' },
  { title: 'Design + Engineering Together', text: 'UI/UX, frontend, backend, and QA work as one focused product team.' },
  { title: 'Real Business Websites', text: 'Hotels, rentals, law offices, business platforms, and client systems built for real users.' },
  { title: 'Built for Launch and Growth', text: 'Responsive, fast, maintainable, and ready for future features.' },
];

export const testimonials = [
  { name: 'Mara Chen', role: 'Operations Lead', quote: 'The team translated a messy internal process into a clean dashboard our staff could actually use.' },
  { name: 'Jon Bell', role: 'Startup Founder', quote: 'They helped us launch our MVP quickly while keeping the product polished enough for early customers.' },
  { name: 'Ari Santos', role: 'Business Owner', quote: 'Communication was clear, the interface looked premium, and the final system saved us hours each week.' },
];

export const contactLinks = ['Email', 'Messenger', 'Facebook', 'GitHub', 'LinkedIn'];

export const CheckIcon = ShieldCheck;
