import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Skill from '@/models/Skill';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find({}).sort({ order: 1 });
    return NextResponse.json(skills);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch skills: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    const item = await Skill.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create skill: ' + err.message }, { status: 500 });
  }
}
