export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

export async function GET() {
  try {
    if (!MONGODB_URI) {
      return NextResponse.json({ 
        status: 'ERROR', 
        error: 'MONGODB_URI is missing in environment variables' 
      });
    }

    // Attempt to connect with a short timeout
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });

    return NextResponse.json({ 
      status: 'SUCCESS', 
      message: 'Database connected successfully!',
      database: conn.connection.name
    });

  } catch (err: any) {
    let type = 'UNKNOWN_ERROR';
    const message = err.message || 'Unknown error';

    if (message.includes('timeout')) {
      type = 'TIMEOUT / IP_BLACKLISTED';
    } else if (message.includes('auth')) {
      type = 'AUTHENTICATION_FAILED';
    } else if (message.includes('DNS')) {
      type = 'DNS_RESOLUTION_FAILED';
    }

    return NextResponse.json({ 
      status: 'ERROR', 
      type,
      message,
      suggestion: type === 'TIMEOUT / IP_BLACKLISTED' 
        ? 'Your IP address might not be whitelisted in MongoDB Atlas.' 
        : 'Please check your MONGODB_URI credentials.'
    });
  }
}
