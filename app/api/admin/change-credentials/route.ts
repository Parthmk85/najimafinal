export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';

const FIXED_ADMIN_USERNAME = 'najima_1234';
const FIXED_ADMIN_PASSWORD = 'artist_1234';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Auth Token
    const auth = verifyToken(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 });
    }

    const { currentUsername, currentPassword, newUsername, newPassword } = await request.json();

    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (currentUsername !== FIXED_ADMIN_USERNAME || currentPassword !== FIXED_ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Current credentials are incorrect' }, { status: 401 });
    }

    if (newUsername !== FIXED_ADMIN_USERNAME || newPassword !== FIXED_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Credentials are locked. Use najima_1234 / artist_1234.' },
        { status: 400 }
      );
    }

    // Keep DB entry aligned with locked credentials when DB is available.
    try {
      await dbConnect();
      const hashedPassword = await bcrypt.hash(FIXED_ADMIN_PASSWORD, 10);
      const admin = await Admin.findOne({});

      if (!admin) {
        await Admin.create({ username: FIXED_ADMIN_USERNAME, password: hashedPassword });
      } else {
        const hasExpectedPassword = await bcrypt.compare(FIXED_ADMIN_PASSWORD, admin.password);
        if (admin.username !== FIXED_ADMIN_USERNAME || !hasExpectedPassword) {
          admin.username = FIXED_ADMIN_USERNAME;
          admin.password = hashedPassword;
          await admin.save();
        }
      }
    } catch (syncError) {
      console.warn('Admin credential sync skipped:', syncError);
    }

    return NextResponse.json({ message: 'Credentials are already fixed and working.' });
  } catch (error) {
    console.error('Change credentials error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
