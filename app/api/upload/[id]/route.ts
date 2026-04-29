import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'node:stream';

import { getMediaFileHandle } from '@/lib/mediaStore';

export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

function toWebStream(stream: NodeJS.ReadableStream): ReadableStream {
  return Readable.toWeb(stream as Readable) as ReadableStream;
}

function safeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const media = await getMediaFileHandle(id);

  if (!media) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const totalSize = media.file.length;
  const fileWithContentType = media.file as typeof media.file & { contentType?: unknown };
  const metadataContentType = (media.file.metadata as { contentType?: unknown } | undefined)?.contentType;
  const rawContentType =
    typeof fileWithContentType.contentType === 'string'
      ? fileWithContentType.contentType
      : typeof metadataContentType === 'string'
        ? metadataContentType
        : null;
  const contentType = rawContentType || 'application/octet-stream';
  const fileName = safeFilename(media.file.filename || `media-${id}`);
  const rangeHeader = request.headers.get('range');

  if (rangeHeader) {
    const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
    if (!match) {
      return new NextResponse('Invalid range', { status: 416 });
    }

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : totalSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end < start || end >= totalSize) {
      return new NextResponse('Requested range not satisfiable', {
        status: 416,
        headers: {
          'Content-Range': `bytes */${totalSize}`,
        },
      });
    }

    const chunkSize = end - start + 1;
    const downloadStream = media.bucket.openDownloadStream(media.objectId, {
      start,
      end: end + 1,
    });

    return new NextResponse(toWebStream(downloadStream), {
      status: 206,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Content-Length': String(chunkSize),
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const downloadStream = media.bucket.openDownloadStream(media.objectId);

  return new NextResponse(toWebStream(downloadStream), {
    status: 200,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': String(totalSize),
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}