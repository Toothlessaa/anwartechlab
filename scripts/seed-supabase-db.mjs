/**
 * Seed script: Migrates existing hardcoded data from portfolio.ts into Supabase.
 *
 * Usage:
 *   1. Make sure your .env has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY set
 *   2. Run: node scripts/seed-supabase-db.mjs
 *
 * NOTE: Add VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your .env first.
 *       The service role key bypasses RLS and is needed for seeding.
 *       Find it at: Supabase Dashboard > Settings > API > service_role key
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('Add these to your .env file:');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('  (Find it at: Supabase Dashboard > Settings > API > service_role key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// =====================================================
// Existing project data (from portfolio.ts)
// =====================================================
const projects = [
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
    image: 'projects/dental.png',
    size: 'hero',
    link: 'https://dentalsbookingg.netlify.app/',
    github: null,
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
    image: 'projects/car.png',
    size: 'medium',
    link: 'https://karrental.netlify.app/',
    github: null,
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
    image: 'projects/venueproject.png',
    size: 'hero',
    link: 'https://venueee.netlify.app/',
    github: null,
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
    image: 'projects/hotel.jpg',
    size: 'medium',
    link: 'https://hotelwebbb.netlify.app/',
    github: null,
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
    image: 'projects/lawoffice.png',
    size: 'wide',
    link: 'https://attyrafaelsantos.netlify.app/',
    github: null,
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
    image: 'projects/success.png',
    size: 'medium',
    link: 'https://successpartnership.netlify.app/',
    github: null,
  },
];

async function seed() {
  console.log('Seeding projects...');
  for (const project of projects) {
    const { error } = await supabase.from('projects').upsert(project, { onConflict: 'id' });
    if (error) {
      console.error(`  Failed to insert project "${project.id}":`, error.message);
    } else {
      console.log(`  ✓ "${project.title}"`);
    }
  }
  console.log('Done!');
}

seed().catch(console.error);
