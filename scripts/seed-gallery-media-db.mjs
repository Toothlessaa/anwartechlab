import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing VITE_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const mediaPosts = [
  {
    id: 'media-bear-market-patience-wins',
    title: 'Navigating the Bear Market: Patience Wins the Long Game',
    category: 'Update',
    summary: 'With my good friend Bontox, a well-known forex and crypto trader now based in Japan',
    content: 'Today, Bitcoin continues to lead the direction of the crypto market. When Bitcoin goes down, most altcoins usually follow its movement, creating fear and uncertainty among many traders. This is why patience, discipline, and proper risk management are very important.\n\nAs a crypto trader, I believe that bear markets are not only moments of fear-they are also moments of learning, preparation, and opportunity. The key is not to panic, but to understand the cycle of the market.\n\nBitcoin has gone through many ups and downs before, yet it remains the strongest symbol of the crypto industry. When Bitcoin starts to recover, many altcoins often follow the same direction. That is why traders must stay calm, continue learning, protect their capital, and wait patiently for the right opportunity.\n\nBull markets create excitement, but bear markets build strong and experienced traders. Patience today can become opportunity tomorrow.',
    description: 'With my good friend Bontox, a well-known forex and crypto trader now based in Japan',
    image: 'media/bitcoin/port1.jpg',
    images: ['media/bitcoin/port1.jpg', 'media/bitcoin/port2.jpg', 'media/bitcoin/port3.jpg', 'media/bitcoin/port4.jpg'],
    date: '2026-07-05',
  },
  {
    id: 'media-gisec-global-2025',
    title: 'CEO Attends GISEC Global 2025: Advancing Cybersecurity Excellence',
    category: 'Event',
    summary: "Our CEO had the privilege of attending GISEC Global 2025, held in Dubai, United Arab Emirates, from May 6-8, 2025, one of the world's premier cybersecurity events and the largest cybersecurity gathering in the Middle East and Africa.",
    content: 'The event brought together cybersecurity professionals, ethical hackers, government agencies, technology leaders, and industry experts from more than 180 countries for three power-packed days of innovation, strategic collaboration, and live cyber drills. Participants explored the latest developments in cyber defense, threat intelligence, artificial intelligence, digital resilience, and emerging security technologies.\n\nAttending GISEC Global reflects our commitment to staying at the forefront of the rapidly evolving cybersecurity landscape. The valuable insights, global connections, and cutting-edge knowledge gained during the event further strengthen our mission to deliver secure, innovative, and future-ready technology solutions for our clients.\n\nAs cyber threats continue to evolve, we remain dedicated to continuous learning, innovation, and adopting global best practices to help businesses protect their digital assets with confidence.',
    description: "Our CEO had the privilege of attending GISEC Global 2025, held from May 6-8, 2025, one of the world's premier cybersecurity events and the largest cybersecurity gathering in the Middle East and Africa.",
    image: 'media/thumbnail.jpg',
    images: ['media/thumbnail.jpg', 'media/2.jpg', 'media/3.jpg', 'media/4.jpg', 'media/5.jpg', 'media/6.jpg', 'media/8.jpg', 'media/9.jpg', 'media/10.jpg', 'media/11.jpg', 'media/12.jpg', 'media/13.jpg'],
    date: '2025-05-06',
  },
];

for (const post of mediaPosts) {
  const { error } = await supabase.from('gallery_items').upsert(post, { onConflict: 'id' });
  if (error) {
    console.error(`Failed to seed ${post.id}:`, error.message);
    process.exitCode = 1;
  } else {
    console.log(`Seeded ${post.id}`);
  }
}
