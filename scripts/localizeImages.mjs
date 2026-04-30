import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import fs from 'node:fs/promises';
import path from 'node:path';

const OLD_URI = "mongodb://najimamam:najimamam@ac-bpevkot-shard-00-00.eik30i6.mongodb.net:27017,ac-bpevkot-shard-00-01.eik30i6.mongodb.net:27017,ac-bpevkot-shard-00-02.eik30i6.mongodb.net:27017/test?ssl=true&replicaSet=atlas-g0kmd3-shard-0&authSource=admin&retryWrites=true&w=majority&appName=najimamam";
const NEW_URI = "mongodb+srv://Vercel-Admin-najima-mehandi-artist:najimamam@najima-mehandi-artist.cta9wzj.mongodb.net/?appName=najima-mehandi-artist";

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const collectionsWithImages = [
  { name: 'projects', fields: ['image'] },
  { name: 'skills', fields: ['image'] },
  { name: 'courses', fields: ['image'] },
  { name: 'feedbacks', fields: ['avatar', 'workImage'] },
  { name: 'globalsettings', fields: ['aboutImage', 'heroImage'] },
  { name: 'videos', fields: ['thumbnail'] }
];

async function localize() {
  console.log('--- Starting Image Localization (V3) ---');

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    console.log('Connecting to databases...');
    const oldConn = await mongoose.createConnection(OLD_URI).asPromise();
    const newConn = await mongoose.createConnection(NEW_URI).asPromise();
    const bucket = new GridFSBucket(oldConn.db, { bucketName: 'media' });
    console.log('Connected.');

    for (const col of collectionsWithImages) {
      console.log(`\nChecking collection: ${col.name}`);
      const docs = await newConn.db.collection(col.name).find({}).toArray();

      for (const doc of docs) {
        for (const field of col.fields) {
          const imgPath = doc[field];
          if (imgPath && typeof imgPath === 'string' && imgPath.startsWith('/api/upload/')) {
            const idStr = imgPath.split('/').pop();
            if (ObjectId.isValid(idStr)) {
              const objectId = new ObjectId(idStr);
              try {
                // 1. Get filename from GridFS
                const files = await bucket.find({ _id: objectId }).toArray();
                if (files.length === 0) {
                  console.warn(`File not found in GridFS: ${idStr} (Skipping field ${field} in ${col.name})`);
                  continue;
                }
                const filename = files[0].filename;
                const localFilename = `${idStr}-${filename}`;
                const localPath = path.join(UPLOAD_DIR, localFilename);

                // 2. Download if not already exists
                try {
                  await fs.access(localPath);
                } catch {
                  console.log(`Downloading ${filename} to local uploads...`);
                  const downloadStream = bucket.openDownloadStream(objectId);
                  const buffer = await new Promise((resolve, reject) => {
                    const chunks = [];
                    downloadStream.on('data', (chunk) => chunks.push(chunk));
                    downloadStream.on('error', reject);
                    downloadStream.on('end', () => resolve(Buffer.concat(chunks)));
                  });
                  await fs.writeFile(localPath, buffer);
                }

                // 3. Update path in new database
                const newPublicPath = `/uploads/${localFilename}`;
                await newConn.db.collection(col.name).updateOne(
                  { _id: doc._id },
                  { $set: { [field]: newPublicPath } }
                );
                console.log(`Updated ${col.name}.${field} for doc ${doc._id} to ${newPublicPath}`);

              } catch (err) {
                console.error(`Failed to localize image ${idStr}:`, err.message);
              }
            }
          }
        }
      }
    }

    await oldConn.close();
    await newConn.close();
    console.log('\n--- Localization Completed Successfully! ---');
  } catch (err) {
    console.error('Localization failed:', err);
    process.exit(1);
  }
}

localize();
