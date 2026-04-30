import mongoose from 'mongoose';

const SOURCE_URI = "mongodb+srv://Vercel-Admin-najima-mehandi-artist:najimamam@najima-mehandi-artist.cta9wzj.mongodb.net/?appName=najima-mehandi-artist";
const TARGET_URI = "mongodb+srv://najima2209:najima2209@najima-mehandi.yxrd19t.mongodb.net/?retryWrites=true&w=majority&appName=najima-mehandi";

const collections = ['admins', 'projects', 'educations', 'gears', 'feedbacks', 'skills', 'courses', 'globalsettings', 'videos'];

async function migrate() {
  console.log('--- Starting Data Migration to Newest Cluster ---');
  
  try {
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();

    console.log('Connected to both databases.');

    for (const colName of collections) {
      console.log(`Migrating collection: ${colName}`);
      const data = await sourceConn.db.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        // Clear target collection first to avoid duplicates if re-running
        await targetConn.db.collection(colName).deleteMany({});
        await targetConn.db.collection(colName).insertMany(data);
        console.log(`Successfully moved ${data.length} documents for ${colName}`);
      } else {
        console.log(`Collection ${colName} is empty. Skipping.`);
      }
    }

    await sourceConn.close();
    await targetConn.close();
    console.log('\n--- Migration Completed Successfully! ---');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
