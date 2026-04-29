import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Feedback from '@/models/Feedback';
import { verifyToken } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const item = await Feedback.findByIdAndUpdate(id, body, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update feedback: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    await Feedback.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete feedback: ' + err.message }, { status: 500 });
  }
}
