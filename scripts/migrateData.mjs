import mongoose from 'mongoose';

const SOURCE_URI = "mongodb+srv://najima2209:najima2209@najima-mehandi.yxrd19t.mongodb.net/test?retryWrites=true&w=majority&appName=najima-mehandi";
const TARGET_URI = "mongodb+srv://Vercel-Admin-najima-mehandi:najima2209@najima-mehandi.yxrd19t.mongodb.net/najima-mehandi?retryWrites=true&w=majority&appName=najima-mehandi";

const collections = ['admins', 'projects', 'educations', 'gears', 'feedbacks', 'skills', 'courses', 'globalsettings', 'videos'];

async function migrate() {
  console.log('--- Moving Data from test to najima-mehandi DB ---');
  
  try {
    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();

    console.log('Connected to both databases.');

    for (const colName of collections) {
      console.log(`Migrating collection: ${colName}`);
      const data = await sourceConn.db.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        await targetConn.db.collection(colName).deleteMany({});
        await targetConn.db.collection(colName).insertMany(data);
        console.log(`Successfully moved ${data.length} documents for ${colName}`);
      } else {
        console.log(`Collection ${colName} is empty in source.`);
      }
    }

    await sourceConn.close();
    await targetConn.close();
    console.log('\n--- Migration Completed! ---');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
