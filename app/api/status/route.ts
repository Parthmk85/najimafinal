import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'Disconnected';
  try {
    await dbConnect();
    dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting';
  } catch (err) {
    dbStatus = 'Error';
  }

  const logs = [
    { id: 1, date: '2026-04-30', time: '11:45:12', type: 'Backend', message: 'Database migrated to Vercel MongoDB Cluster.' },
    { id: 2, date: '2026-04-30', time: '11:52:05', type: 'Storage', message: 'Image storage shifted from GridFS to Local (/public/uploads).' },
    { id: 3, date: '2026-04-30', time: '12:10:33', type: 'Assets', message: 'Images localized and paths updated in DB.' },
    { id: 4, date: '2026-04-30', time: '12:25:50', type: 'Frontend', message: 'Admin Dashboard input synchronization fix applied.' },
    { id: 5, date: '2026-04-30', time: '12:32:15', type: 'Config', message: '.gitignore updated to allow upload persistence.' },
    { id: 6, date: '2026-04-30', time: '13:02:44', type: 'Database', message: 'Switched to official Vercel Admin credentials.' },
  ];

  return NextResponse.json({
    status: 'Ready',
    database: {
      name: 'najima-mehandi (Vercel)',
      connection: dbStatus,
    },
    storage: {
      type: 'Local Filesystem',
      path: '/public/uploads',
      sync: 'GitHub Enabled'
    },
    recentLogs: logs
  });
}
