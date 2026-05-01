import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getFile } from '@/lib/fileStore';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Backward compat: serve files that were saved locally before GridFS migration
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, id);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(id).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.webm': 'video/webm',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    return new NextResponse(fileBuffer, {
      headers: { 'Content-Type': contentType },
    });
  }

  // Serve from GridFS (new uploads)
  const result = await getFile(id);
  if (!result) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return new NextResponse(result.buffer as unknown as BodyInit, {
    headers: { 'Content-Type': result.contentType },
  });
}