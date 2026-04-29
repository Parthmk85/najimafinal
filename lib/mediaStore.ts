import mongoose from 'mongoose';
import { GridFSBucket, ObjectId, type GridFSFile } from 'mongodb';

import dbConnect from '@/lib/dbConnect';

const MEDIA_BUCKET_NAME = 'media';

export type MediaFileHandle = {
  bucket: GridFSBucket;
  file: GridFSFile;
  objectId: ObjectId;
};

type SaveMediaInput = {
  buffer: Buffer;
  filename: string;
  contentType: string;
  metadata?: Record<string, unknown>;
};

async function getMediaBucket(): Promise<GridFSBucket> {
  await dbConnect();

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection is not initialized');
  }

  return new GridFSBucket(db, { bucketName: MEDIA_BUCKET_NAME });
}

export async function saveMediaFile(input: SaveMediaInput): Promise<string> {
  const bucket = await getMediaBucket();

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(input.filename, {
      metadata: { ...(input.metadata ?? {}), contentType: input.contentType },
    });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString());
    });

    uploadStream.end(input.buffer);
  });
}

export async function getMediaFileHandle(id: string): Promise<MediaFileHandle | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const objectId = new ObjectId(id);
  const bucket = await getMediaBucket();
  const file = await bucket.find({ _id: objectId }).next();

  if (!file) {
    return null;
  }

  return { bucket, file, objectId };
}