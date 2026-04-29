import * as dotenv from 'dotenv';
import path from 'path';

// Load env FIRST before anything else
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import the rest
import dbConnect from './lib/dbConnect';
import Skill from './models/Skill';

const skills = [
  { title: "Bridal Designs", image: "/skills/bridal.png", order: 1 },
  { title: "Indian Designs", image: "/skills/indian.png", order: 2 },
  { title: "Pakistani Designs", image: "/skills/pakistani.png", order: 3 },
  { title: "Dubai Designs", image: "/skills/dubai.png", order: 4 },
  { title: "Simplest Designs", image: "/skills/simple.png", order: 5 },
  { title: "Doha Designs", image: "/skills/doha.png", order: 6 },
  { title: "Khfif Designs", image: "/skills/khfif.png", order: 7 },
  { title: "Festival Designs", image: "/skills/festival.png", order: 8 },
  { title: "Engagement Designs", image: "/skills/engagement.png", order: 9 },
];

async function seed() {
  try {
    console.log('Connecting to DB...');
    await dbConnect();
    
    console.log('Clearing old skills...');
    await Skill.deleteMany({});
    
    console.log('Inserting new skills...');
    await Skill.insertMany(skills);
    
    console.log('Seeding successful!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
