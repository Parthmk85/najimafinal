export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

const FIXED_ADMIN_USERNAME = 'najima_1234';
const FIXED_ADMIN_PASSWORD = 'artist_1234';

async function syncFixedCredentialsToDb() {
  await dbConnect();

  const admin = await Admin.findOne({});
  const hashedPassword = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 10);

  if (!admin) {
    await Admin.create({ username: FIXED_ADMIN_USERNAME, password: hashedPassword });
    return;
  }

  const hasExpectedPassword = await bcrypt.compare(FIXED_ADMIN_PASSWORD, admin.password);
  if (admin.username !== FIXED_ADMIN_USERNAME || !hasExpectedPassword) {
    admin.username = FIXED_ADMIN_USERNAME;
    admin.password = hashedPassword;
    await admin.save();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Keep admin credentials fixed to the requested values.
    if (username !== FIXED_ADMIN_USERNAME || password !== FIXED_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Best-effort DB sync so existing data stays aligned, but do not block login on DB outages.
    try {
      await syncFixedCredentialsToDb();
    } catch (syncError) {
      console.warn('Admin credential DB sync skipped:', syncError);
    }

    const token = signToken({ username: FIXED_ADMIN_USERNAME, role: 'admin' });
    return NextResponse.json({ token, username: FIXED_ADMIN_USERNAME });
  } catch (error) {
    console.error('Login error:', error);
    const details =
      process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined;
    return NextResponse.json({ error: 'Server error', details }, { status: 500 });
  }
}
