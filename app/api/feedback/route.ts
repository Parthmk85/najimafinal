import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Feedback from '@/models/Feedback';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const feedback = await Feedback.find({}).sort({ order: 1 });
    return NextResponse.json(feedback);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch feedback: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const item = await Feedback.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create feedback: ' + err.message }, { status: 500 });
  }
}
