import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';

function readMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const envFile = fs.existsSync(path.resolve('.env')) ? '.env' : '.env.local';
  const envPath = path.resolve(envFile);
  const envRaw = fs.readFileSync(envPath, 'utf8');
  const line = envRaw
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith('MONGODB_URI='));

  if (!line) {
    throw new Error('MONGODB_URI not found in process.env, .env, or .env.local');
  }

  return line.slice('MONGODB_URI='.length).trim();
}

const settings = {
  heroTitle: 'Vision of Akash',
  heroSubTitle: 'Creative Motion Studio',
  heroDescription:
    'Stories, shoots, reels and edits that build premium brand presence with cinematic Gujarati-first storytelling.',
  stats: [
    { value: '250+', label: 'Projects Delivered' },
    { value: '50M+', label: 'Organic Views' },
    { value: '98%', label: 'Client Retention' },
  ],
  socials: [
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'YouTube', url: 'https://youtube.com' },
    { platform: 'Facebook', url: 'https://facebook.com' },
  ],
  contactEmail: 'visionofakash@gmail.com',
  contactPhone: '+91 88663 37539',
  contactAddress: 'Ahmedabad, Gujarat, India',
  aboutImage: '/assets/img3.jpeg',
  languages: 'Gujarati, Hindi, English',
  heroBadgeText: 'ALL GUJARAT SERVICE AVAILABLE',
  heroBadgeShow: true,
};

const skills = [
  {
    categoryTitle: 'Content Strategy',
    icon: 'strategy',
    skills: ['Brand Positioning', 'Campaign Planning', 'Audience Insights', 'Content Calendar Design'],
    order: 1,
  },
  {
    categoryTitle: 'Production Excellence',
    icon: 'production',
    skills: ['Cinematic Shooting', 'Lighting Direction', 'Sound Capture', 'Multi-Camera Handling'],
    order: 2,
  },
  {
    categoryTitle: 'Creative Post',
    icon: 'creative',
    skills: ['Reels Editing', 'Color Grading', 'Motion Graphics', 'Story-driven Pacing'],
    order: 3,
  },
];

const services = [
  {
    title: 'Automobile Ads',
    icon: 'car',
    num: '01',
    description: 'Premium automotive reels, launch teasers, and dealer campaign edits built for high engagement.',
    isFeatured: false,
    tag: 'Performance',
    order: 1,
  },
  {
    title: 'Cinematic Brand Films',
    icon: 'film',
    num: '02',
    description: 'Story-first brand films with polished visuals, pacing, and platform-ready cuts.',
    isFeatured: true,
    tag: 'Most Popular',
    order: 2,
  },
  {
    title: 'Instagram Reels',
    icon: 'instagram',
    num: '03',
    description: 'Short-form content optimized for retention, saves, shares, and profile growth.',
    isFeatured: false,
    tag: 'Growth',
    order: 3,
  },
  {
    title: 'Wedding Stories',
    icon: 'ring',
    num: '04',
    description: 'Elegant wedding highlight edits crafted with emotional storytelling and luxury tone.',
    isFeatured: false,
    tag: 'Lifestyle',
    order: 4,
  },
  {
    title: 'Music Videos',
    icon: 'video',
    num: '05',
    description: 'Performance and concept music visuals cut with rhythm-based cinematic transitions.',
    isFeatured: false,
    tag: 'Creative',
    order: 5,
  },
  {
    title: 'Event Coverage',
    icon: 'stars',
    num: '06',
    description: 'Corporate and social event coverage with same-day social media output options.',
    isFeatured: false,
    tag: 'Live',
    order: 6,
  },
  {
    title: 'Product Launch Videos',
    icon: 'bag',
    num: '07',
    description: 'Product-first scripts and edits that convert attention into clear purchase intent.',
    isFeatured: false,
    tag: 'Sales',
    order: 7,
  },
  {
    title: 'Corporate Profiles',
    icon: 'briefcase',
    num: '08',
    description: 'Professional brand profile videos tailored for websites, investor decks, and social media.',
    isFeatured: false,
    tag: 'Business',
    order: 8,
  },
];

const education = [
  {
    degree: 'B.Com in Marketing',
    short: 'Bachelor Program',
    year: '2019 - 2022',
    status: 'Completed',
    statusType: 'done',
    icon: 'graduation',
    schoolName: 'Gujarat University',
    schoolShort: 'GUJ Uni',
    location: 'Ahmedabad',
    order: 1,
  },
  {
    degree: 'Advanced Film Editing & Color',
    short: 'Professional Certification',
    year: '2022 - 2023',
    status: 'Certified',
    statusType: 'done',
    icon: 'book',
    schoolName: 'Gujarat University',
    schoolShort: 'GUJ Uni',
    location: 'Ahmedabad',
    order: 2,
  },
  {
    degree: 'Brand Storytelling & Digital Media',
    short: 'Specialization',
    year: '2024 - Present',
    status: 'In Progress',
    statusType: 'current',
    icon: 'book',
    schoolName: 'Gujarat University',
    schoolShort: 'GUJ Uni',
    location: 'Ahmedabad',
    order: 3,
  },
];

const gear = [
  {
    name: 'iPhone 15 Pro Max',
    subtitle: 'Primary Capture Device',
    description: 'High-detail mobile capture with stable 4K output ideal for reels and product shoots.',
    icon: 'iphone',
    tags: ['4K', 'ProRes', 'Mobile Setup'],
    order: 1,
  },
  {
    name: 'DJI Gimbal',
    subtitle: 'Stabilization System',
    description: 'Smooth cinematic movement for walk-throughs, events, and dynamic product shots.',
    icon: 'gimbal',
    tags: ['Stabilized', 'Tracking', 'Motion'],
    order: 2,
  },
  {
    name: 'Sony Mirrorless Kit',
    subtitle: 'Secondary Camera Rig',
    description: 'Depth-rich footage for interviews, portraits, and high-end cinematic sequences.',
    icon: 'camera',
    tags: ['APS-C', 'Prime Lens', 'Cinematic'],
    order: 3,
  },
  {
    name: 'Wireless Audio + Shotgun Mic',
    subtitle: 'Audio Suite',
    description: 'Clean voice capture for talking heads, interviews, and on-location projects.',
    icon: 'mic',
    tags: ['Clear Voice', 'Outdoor Ready', 'Interview'],
    order: 4,
  },
  {
    name: 'Portable Light Kit',
    subtitle: 'Lighting Control',
    description: 'Soft and hard light control for mood-driven frames and clean commercial look.',
    icon: 'light',
    tags: ['RGB', 'Softbox', 'Battery'],
    order: 5,
  },
  {
    name: 'Editing Workstation',
    subtitle: 'Post-Production Setup',
    description: 'Fast rendering and grading workflow for quick delivery with premium quality.',
    icon: 'laptop',
    tags: ['Premiere', 'DaVinci', 'Fast Export'],
    order: 6,
  },
];

const projects = [
  {
    title: 'Luxury Product Reel',
    category: 'Commercial',
    image: '/to1.jpeg',
    link: 'https://instagram.com',
    stats: { likes: '24k', views: '1.2M' },
    featured: true,
    order: 1,
  },
  {
    title: 'Wedding Story Highlights',
    category: 'Wedding',
    image: '/to2.jpeg',
    link: 'https://instagram.com',
    stats: { likes: '31k', views: '1.8M' },
    featured: false,
    order: 2,
  },
  {
    title: 'Auto Launch Campaign',
    category: 'Automobile',
    image: '/to3.jpeg',
    link: 'https://instagram.com',
    stats: { likes: '18k', views: '950k' },
    featured: false,
    order: 3,
  },
  {
    title: 'Food Brand Motion Ad',
    category: 'Hospitality',
    image: '/to4.jpeg',
    link: 'https://instagram.com',
    stats: { likes: '27k', views: '1.4M' },
    featured: false,
    order: 4,
  },
];

const videos = [
  {
    title: 'Brand Film: Premium Launch',
    description: 'Full campaign reveal edit with cinematic pacing and product storytelling.',
    thumbnail: '/portfolio/dashboard.png',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'Brand Film',
    featured: true,
    order: 1,
  },
  {
    title: 'Event Reel: Wedding Highlights',
    description: 'Emotion-focused social reel cut for reach and rewatch value.',
    thumbnail: '/portfolio/healthcare.png',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    category: 'Wedding',
    featured: false,
    order: 2,
  },
  {
    title: 'Commercial Edit: Auto Promo',
    description: 'High-tempo automotive campaign video optimized for Instagram audience.',
    thumbnail: '/portfolio/vpn.png',
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    category: 'Commercial',
    featured: false,
    order: 3,
  },
];

const feedback = [
  {
    name: 'Rohan Mehta',
    role: 'Brand Manager',
    brand: 'Urban Leaf',
    text: 'Akash e amara campaign na shots ne evu story ma convert karya ke loko ne instantly yaad rahi gaya. Pahla hafta ma j engagement vadhi gayu ane content full premium lagyu.',
    avatar: 'R',
    metric: '+42% engagement',
    rating: 5,
    order: 1,
  },
  {
    name: 'Priya Shah',
    role: 'Fashion Blogger',
    brand: 'Style Journal',
    text: 'Mood, pacing ane luxury look Akash turant samji jay che. Mane vibe explain pan ochhi karvi padi ane final reel reference karta pan better aavi.',
    avatar: 'P',
    metric: 'Same-day revisions',
    rating: 5,
    order: 2,
  },
  {
    name: 'Amit Patel',
    role: 'Business Owner',
    brand: 'Patel Ventures',
    text: 'Fast che, professional che ane kaam ma ekdum sharp che. Business ne serious ane modern look aapvo hoy to Akash par bharoso kari sakay.',
    avatar: 'A',
    metric: 'Booked 3 launches',
    rating: 5,
    order: 3,
  },
  {
    name: 'Neha Desai',
    role: 'Wedding Filmmaker',
    brand: 'Desai Stories',
    text: 'Hu e ne tough multi-camera edit moklyo hato almost brief vagar. Ene emotion pakdi lidho, pacing clean kari ane akhi film ne cinematic feel api.',
    avatar: 'N',
    metric: '48-hour turnaround',
    rating: 5,
    order: 4,
  },
  {
    name: 'Jay Solanki',
    role: 'Music Artist',
    brand: 'Independent Release',
    text: 'Mara music videos finally proper release jeva dekhava lagya, normal social clips jeva nahi. Ena cuts musical che, stylish che ane perfectly timed che.',
    avatar: 'J',
    metric: '+118k reel views',
    rating: 5,
    order: 5,
  },
  {
    name: 'Kavya Trivedi',
    role: 'Beauty Creator',
    brand: 'Glow Theory',
    text: 'Mara beauty reels ni retention clearly improve thai, karan ke Akash ne exactly khabar che kyare frame change karvo ane kyare visual energy high rakhvi.',
    avatar: 'K',
    metric: '+31% watch time',
    rating: 5,
    order: 6,
  },
  {
    name: 'Harsh Vora',
    role: 'Restaurant Founder',
    brand: 'Table 27',
    text: 'Akash e amara local restaurant ne pan luxury destination jevi feel api. Darekh video ma atmosphere, appetite ane brand ni alag identity dekhaay che.',
    avatar: 'H',
    metric: 'Sold-out launch weekend',
    rating: 5,
    order: 7,
  },
  {
    name: 'Mitali Joshi',
    role: 'Lifestyle Creator',
    brand: 'Daily By Mitali',
    text: 'Creative pan che ane reliable pan, aa combo khub rare male. Files properly organized hoy, revisions smooth hoy ane final output hamesha elevated lage.',
    avatar: 'M',
    metric: 'Zero missed deadlines',
    rating: 5,
    order: 8,
  },
  {
    name: 'Devang Bhatt',
    role: 'Startup Founder',
    brand: 'LaunchSprint',
    text: 'Amne founder-led content joiye hato je polished lage pan fake na lage. Akash e exact balance pakdi ne brand ne strong public face aapyu.',
    avatar: 'D',
    metric: '+3 investor callbacks',
    rating: 5,
    order: 9,
  },
  {
    name: 'Sonal Parmar',
    role: 'Event Curator',
    brand: 'House of Events',
    text: 'Ene amara event ni energy perfectly capture kari ane ene eva reels ma convert kari ke badhu live feel thay. Sponsors e pan puchyu ke edit ane visual direction kone handle kari.',
    avatar: 'S',
    metric: 'Sponsor-approved edits',
    rating: 5,
    order: 10,
  },
];

async function seed() {
  const uri = readMongoUri();
  await mongoose.connect(uri);

  const db = mongoose.connection.db;

  await db.collection('globalsettings').deleteMany({});
  await db.collection('skills').deleteMany({});
  await db.collection('services').deleteMany({});
  await db.collection('educations').deleteMany({});
  await db.collection('gears').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('videos').deleteMany({});
  await db.collection('feedbacks').deleteMany({});

  await db.collection('globalsettings').insertOne(settings);
  await db.collection('skills').insertMany(skills);
  await db.collection('services').insertMany(services);
  await db.collection('educations').insertMany(education);
  await db.collection('gears').insertMany(gear);
  await db.collection('projects').insertMany(projects);
  await db.collection('videos').insertMany(videos);
  await db.collection('feedbacks').insertMany(feedback);

  const counts = {
    settings: await db.collection('globalsettings').countDocuments(),
    skills: await db.collection('skills').countDocuments(),
    services: await db.collection('services').countDocuments(),
    education: await db.collection('educations').countDocuments(),
    gear: await db.collection('gears').countDocuments(),
    projects: await db.collection('projects').countDocuments(),
    videos: await db.collection('videos').countDocuments(),
    feedback: await db.collection('feedbacks').countDocuments(),
  };

  console.log('Seed completed:', counts);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect error
  }
  process.exit(1);
});
