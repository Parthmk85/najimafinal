export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { saveFile } from '@/lib/fileStore';

export const runtime = 'nodejs';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024;

function getExtension(file: File): string {
  const originalExt = path.extname(file.name || '').toLowerCase();
  if (originalExt) return originalExt;

  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'video/webm': '.webm',
  };

  return mimeMap[file.type] || '.bin';
}

function getSizeLimit(file: File): number {
  return file.type.startsWith('video/') ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
}

function isAllowedFile(file: File): boolean {
  return file.type.startsWith('image/') || file.type.startsWith('video/');
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!isAllowedFile(file)) {
      return NextResponse.json({ error: 'Only image and video files are allowed' }, { status: 400 });
    }

    const sizeLimit = getSizeLimit(file);
    if (file.size > sizeLimit) {
      const maxMb = Math.floor(sizeLimit / (1024 * 1024));
      return NextResponse.json({ error: `File size must be ${maxMb}MB or less` }, { status: 400 });
    }

    const ext = getExtension(file);
    const fileName = `media-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save to GridFS (works on Vercel and any serverless environment)
    const url = await saveFile(buffer, fileName, file.type);
    const id = url.split('/').pop()!;

    return NextResponse.json({ url, id });
  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
    return NextResponse.json({ error: 'Upload failed', details: errorMessage }, { status: 500 });
  }
}
