import dns from 'dns';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

// Ensure reliable DNS for SRV lookups on all platforms
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function getConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not defined');
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  return { client, bucket };
}

/**
 * Saves a file buffer to MongoDB GridFS.
 * Returns the public URL path for the file (served via /api/upload/[id]).
 */
export async function saveFile(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const { client, bucket } = await getConnection();
  try {
    const id: string = await new Promise((resolve, reject) => {
      const stream = bucket.openUploadStream(fileName, {
        metadata: { contentType },
      });
      stream.on('finish', () => resolve(stream.id.toString()));
      stream.on('error', reject);
      stream.end(buffer);
    });
    return `/api/upload/${id}`;
  } finally {
    await client.close();
  }
}

/**
 * Retrieves a file from MongoDB GridFS by its ObjectId string.
 */
export async function getFile(id: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const { client, bucket } = await getConnection();
  try {
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return null;
    }

    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files.length) return null;

    const file = files[0];
    const contentType = (file.metadata?.contentType as string) || 'application/octet-stream';

    const chunks: Buffer[] = [];
    const stream = bucket.openDownloadStream(objectId);

    return await new Promise((resolve, reject) => {
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType }));
      stream.on('error', reject);
    });
  } finally {
    await client.close();
  }
}
