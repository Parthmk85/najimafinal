import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const service = await Service.findByIdAndUpdate(id, body, { new: true });
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update service: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await params;
    await Service.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete service: ' + err.message }, { status: 500 });
  }
}
