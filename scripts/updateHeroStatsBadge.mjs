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

await mongoose.connect(mongoUri);

const db = mongoose.connection.db;

await db.collection('globalsettings').updateOne(
  {},
  {
    $set: {
      stats: [
        { value: '1000+', label: 'Projects' },
        { value: '10K+', label: 'Followers' },
      ],
      heroBadgeText: 'ALL GUJARAT SERVICE AVAILABLE',
      heroBadgeShow: true,
    },
  },
  { upsert: true }
);

const settings = await db.collection('globalsettings').findOne({});
console.log('Updated stats:', JSON.stringify(settings?.stats || []));
console.log('Updated badge:', settings?.heroBadgeText, '| show:', settings?.heroBadgeShow);

await mongoose.disconnect();
