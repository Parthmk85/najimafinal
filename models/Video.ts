import { Schema, Document, models, model } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, required: true },
  videoUrl: { type: String, required: true },
  category: { type: String, default: 'General' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Video || model<IVideo>('Video', VideoSchema);
