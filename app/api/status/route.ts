import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dbStatus = 'Connected';
  let dbError = null;
  
  try {
    await dbConnect();
    dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting';
  } catch (err: any) {
    dbStatus = 'Error';
    dbError = err.message;
  }

  // Console Style Logs with Error/Warning Handling
  const logs = [
    { id: 1, type: 'info', message: '▲ Next.js 16.2.2 (Turbopack)' },
    { id: 2, type: 'info', message: '  - Local:         http://localhost:3000' },
    { id: 3, type: 'success', message: '✓ Ready in 822ms' },
    { id: 4, type: 'warning', message: '⚠ [Next.js] Image LCP detected: "/portfolio/New folder/..."' },
    { id: 5, type: 'database', message: '[DB] INITIALIZING CONNECTION...' },
    { id: 6, type: 'database', message: '[DB] URL: najima-mehandi.yxrd19t.mongodb.net' },
  ];

  if (dbStatus === 'Error') {
    logs.push({ id: 7, type: 'error', message: `⨯ [DB] CONNECTION FAILED: ${dbError}` });
    logs.push({ id: 8, type: 'error', message: '⨯ [DB] Check your credentials or IP whitelist in MongoDB Atlas.' });
  } else {
    logs.push({ id: 7, type: 'success', message: `✓ [DB] ${dbStatus.toUpperCase()} SUCCESSFULLY` });
    logs.push({ id: 8, type: 'info', message: '  - User: Vercel-Admin-najima-mehandi' });
  }

  // Simulate some common events from the console
  logs.push({ id: 10, type: 'event', message: '○ Compiling /api/status ...' });
  logs.push({ id: 11, type: 'success', message: '✓ Compiled /api/status in 145ms' });

  return NextResponse.json({
    cwd: 'C:\\Users\\parth\\Downloads\\akash-1-master (1)\\najima',
    recentLogs: logs
  });
}
