import mongoose from 'mongoose';

// Connection Strings
const SOURCE_URI = "mongodb://najimamam:najimamam@ac-bpevkot-shard-00-00.eik30i6.mongodb.net:27017,ac-bpevkot-shard-00-01.eik30i6.mongodb.net:27017,ac-bpevkot-shard-00-02.eik30i6.mongodb.net:27017/test?ssl=true&replicaSet=atlas-g0kmd3-shard-0&authSource=admin&retryWrites=true&w=majority&appName=najimamam";
const DEST_URI = "mongodb+srv://Vercel-Admin-najima-mehandi-artist:najimamam@najima-mehandi-artist.cta9wzj.mongodb.net/?appName=najima-mehandi-artist";

const collections = [
  'admins',
  'courses',
  'educations',
  'feedbacks',
  'gears',
  'globalsettings',
  'projects',
  'services',
  'skills',
  'videos'
];

async function migrate() {
  console.log('--- Starting Migration ---');

  try {
    // 1. Connect to Source
    console.log('Connecting to SOURCE database...');
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('Connected to Source.');

    const dataMap = {};

    // 2. Fetch Data
    for (const colName of collections) {
      try {
        console.log(`Fetching data from ${colName}...`);
        const data = await sourceConn.db.collection(colName).find({}).toArray();
        dataMap[colName] = data;
        console.log(`Found ${data.length} documents in ${colName}.`);
      } catch (err) {
        console.warn(`Could not fetch from ${colName}: ${err.message}`);
      }
    }

    await sourceConn.close();
    console.log('Source connection closed.');

    // 3. Connect to Destination
    console.log('\nConnecting to DESTINATION database...');
    const destConn = await mongoose.createConnection(DEST_URI).asPromise();
    console.log('Connected to Destination.');

    // 4. Insert Data
    for (const colName of collections) {
      const data = dataMap[colName];
      if (data && data.length > 0) {
        console.log(`Migrating ${data.length} documents to ${colName}...`);
        
        // Clear destination collection first to avoid duplicates
        await destConn.db.collection(colName).deleteMany({});
        
        await destConn.db.collection(colName).insertMany(data);
        console.log(`Successfully migrated ${colName}.`);
      } else {
        console.log(`No data found for ${colName}, skipping.`);
      }
    }

    await destConn.close();
    console.log('\n--- Migration Completed Successfully! ---');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
