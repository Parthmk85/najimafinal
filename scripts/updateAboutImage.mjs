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
const aboutImage = '/assets/img3.jpeg';

await db.collection('globalsettings').updateOne(
  {},
  {
    $set: {
      aboutImage,
    },
  },
  { upsert: true }
);

const settings = await db.collection('globalsettings').findOne({});
console.log('aboutImage set to:', settings?.aboutImage || '');

await mongoose.disconnect();
