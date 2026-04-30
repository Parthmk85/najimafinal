import mongoose from 'mongoose';

// SOURCE: Original database from the start
const SOURCE_URI = "mongodb+srv://Vercel-Admin-najima-mehandi-artist:najimamam@najima-mehandi-artist.cta9wzj.mongodb.net/?appName=najima-mehandi-artist";
// TARGET: Official Vercel Admin cluster
const TARGET_URI = "mongodb+srv://Vercel-Admin-najima-mehandi:najima2209@najima-mehandi.yxrd19t.mongodb.net/najima-mehandi?retryWrites=true&w=majority";

const collections = ['admins', 'projects', 'educations', 'gears', 'feedbacks', 'skills', 'courses', 'globalsettings', 'videos'];

async function migrate() {
  console.log('--- Final Migration Start (Original to Target) ---');
  
  try {
    console.log('Connecting to Source...');
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    console.log('Source Connected.');

    console.log('Connecting to Target...');
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
    console.log('Target Connected.');

    for (const colName of collections) {
      console.log(`Working on: ${colName}`);
      const data = await sourceConn.db.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        await targetConn.db.collection(colName).deleteMany({});
        await targetConn.db.collection(colName).insertMany(data);
        console.log(`Success: Moved ${data.length} docs for ${colName}`);
      } else {
        console.log(`Empty collection: ${colName}`);
      }
    }

    await sourceConn.close();
    await targetConn.close();
    console.log('--- Migration Finished Successfully! ---');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
