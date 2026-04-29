import fs from 'node:fs';
import mongoose from 'mongoose';

function readMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const envPath = fs.existsSync('.env') ? '.env' : '.env.local';
  const env = fs.readFileSync(envPath, 'utf8');
  const mongoUri = (env.match(/^MONGODB_URI=(.*)$/m) || [])[1];

  return mongoUri;
}

const mongoUri = readMongoUri();

if (!mongoUri) {
  throw new Error('MONGODB_URI not found in process.env, .env, or .env.local');
}

const services = [
  {
    title: 'Business Reel Shooting',
    icon: 'film',
    num: '01',
    description: 'Brand-focused reel shoots for businesses with premium framing and storytelling.',
    isFeatured: false,
    tag: 'Business',
    order: 1,
  },
  {
    title: 'Instagram Handling',
    icon: 'instagram',
    num: '02',
    description: 'Profile content planning, reel publishing, and consistent growth-oriented handling.',
    isFeatured: false,
    tag: 'Growth',
    order: 2,
  },
  {
    title: 'Freelancing',
    icon: 'briefcase',
    num: '03',
    description: 'Flexible freelance content production and editing support for ongoing campaigns.',
    isFeatured: false,
    tag: 'Flexible',
    order: 3,
  },
  {
    title: 'Wedding Reels',
    icon: 'ring',
    num: '04',
    description: 'Cinematic wedding reel edits with emotional pacing and elegant visual treatment.',
    isFeatured: false,
    tag: 'Lifestyle',
    order: 4,
  },
  {
    title: 'Car/Bike Delivery Shooting',
    icon: 'car',
    num: '05',
    description: 'High-energy delivery and launch shoots for cars and bikes with cinematic motion.',
    isFeatured: true,
    tag: 'Main Service',
    order: 5,
  },
  {
    title: 'Event Video Shoot',
    icon: 'video',
    num: '06',
    description: 'Professional event coverage with social-ready edits and highlight storytelling.',
    isFeatured: false,
    tag: 'Live',
    order: 6,
  },
  {
    title: 'Birthday Shoot',
    icon: 'cake',
    num: '07',
    description: 'Creative birthday shoots with fun compositions and memorable highlight cuts.',
    isFeatured: false,
    tag: 'Celebration',
    order: 7,
  },
  {
    title: 'Home Interior Video',
    icon: 'home',
    num: '08',
    description: 'Interior walkthrough videos designed for premium architecture and decor showcasing.',
    isFeatured: false,
    tag: 'Interior',
    order: 8,
  },
  {
    title: 'Short Cinematic Video',
    icon: 'clapperboard',
    num: '09',
    description: 'Short cinematic storytelling edits for brand and personal visual identity.',
    isFeatured: false,
    tag: 'Cinematic',
    order: 9,
  },
  {
    title: 'Opening Reels',
    icon: 'stars',
    num: '10',
    description: 'Attention-grabbing opening reels for stores, events, and campaign launches.',
    isFeatured: false,
    tag: 'Launch',
    order: 10,
  },
  {
    title: 'Shop Reels',
    icon: 'bag',
    num: '11',
    description: 'Product and store showcase reels optimized for local engagement and conversions.',
    isFeatured: false,
    tag: 'Retail',
    order: 11,
  },
];

await mongoose.connect(mongoUri);
const db = mongoose.connection.db;

await db.collection('services').deleteMany({});
await db.collection('services').insertMany(services);

const saved = await db.collection('services').find({}).sort({ order: 1 }).toArray();
const featured = saved.find((s) => s.isFeatured);

console.log('Services updated count:', saved.length);
console.log('Featured service:', featured?.title || 'None');
console.log('Ordered titles:', saved.map((s) => s.title).join(' | '));

await mongoose.disconnect();
