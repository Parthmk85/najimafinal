import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';

// GET — public, returns all projects
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to fetch projects: ${msg}` }, { status: 500 });
  }
}

// POST — admin only, create project
export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    await dbConnect();
    const body = await request.json();
    
    // Safety check: Ensure legacy required fields are present to satisfy old model versions
    const normalizedBody = {
      ...body,
      category: body.category || "",
      link: body.link || "",
      stats: body.stats || { likes: "0", views: "0" }
    };

    const project = await Project.create(normalizedBody);
    return NextResponse.json(project, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create project';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
