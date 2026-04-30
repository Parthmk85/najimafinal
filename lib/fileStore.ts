import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Saves a file buffer to the public/uploads directory.
 * Returns the public URL path for the file.
 */
export async function saveFileLocally(buffer: Buffer, fileName: string): Promise<string> {
  // Ensure the uploads directory exists
  try {
    await fs.access(UPLOAD_DIR);
  } catch (err) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  // Save the file
  const filePath = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(filePath, buffer);

  // Return the public URL
  return `/uploads/${fileName}`;
}
