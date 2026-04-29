import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Education from '@/models/Education';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const education = await Education.find({}).sort({ order: 1 });
    return NextResponse.json(education);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch education: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const item = await Education.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create education: ' + err.message }, { status: 500 });
  }
}
