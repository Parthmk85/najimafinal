import mongoose from 'mongoose';
import dns from 'dns';

// Node.js on some systems (WSL, certain Windows setups) defaults to 127.0.0.1 as DNS
// which has nothing listening, causing SRV lookups for mongodb+srv:// to fail.
// Force reliable public DNS resolvers before any connection attempt.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
   
  var mongooseCache: MongooseCache;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

// Force reset if we previously had an error (helps recovery after IP whitelisting)
if (cached.promise && !cached.conn) {
  cached.promise = null;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  // Read env vars lazily so that importing this module at build time does not crash.
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not defined. Set it in .env.local for local dev or in your hosting provider\'s environment variables for production.'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      family: 4, // Force IPv4
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }).catch(err => {
      cached.promise = null; // Clear if it fails so it can retry
      global.mongooseCache = { conn: null, promise: null }; // Also clear global object
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // Ensure it's cleared even here
    throw err;
  }
  return cached.conn;
}

export default dbConnect;
