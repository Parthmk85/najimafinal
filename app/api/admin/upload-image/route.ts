export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { verifyToken } from '@/lib/auth';
import { saveMediaFile } from '@/lib/mediaStore';

export const runtime = 'nodejs';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

function getExtension(file: File): string {
  const originalExt = path.extname(file.name || '').toLowerCase();
  if (originalExt) return originalExt;

  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };

  return mimeMap[file.type] || '.jpg';
}

export async function POST(request: NextRequest) {
  const auth = verifyToken(request);
  if (!auth.valid) return NextResponse.json({ error: auth.error }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image size must be 5MB or less' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = getExtension(file);
    const fileName = `about-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const mediaId = await saveMediaFile({
      buffer,
      filename: fileName,
      contentType: file.type || 'application/octet-stream',
      metadata: {
        originalName: file.name,
        size: file.size,
        scope: 'settings-image',
      },
    });

    return NextResponse.json({ url: `/api/upload/${mediaId}`, id: mediaId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
