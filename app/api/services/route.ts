import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Service from '@/models/Service';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ order: 1 });
    return NextResponse.json(services);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch services: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json(service, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create service: ' + err.message }, { status: 500 });
  }
}
