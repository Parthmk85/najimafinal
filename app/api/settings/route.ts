import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import GlobalSettings from '@/models/GlobalSettings';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    let settings = await GlobalSettings.findOne({});
    if (!settings) {
      // Return default values if nothing in DB yet
      settings = new GlobalSettings({});
    }
    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const settings = await GlobalSettings.findOne({});
    if (settings) {
      await GlobalSettings.findByIdAndUpdate(settings._id, body);
    } else {
      await GlobalSettings.create(body);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings: ' + err.message }, { status: 500 });
  }
}
