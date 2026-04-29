import { Schema, Document, models, model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: string;
  image: string;
  link: string;
  stats: { likes: string; views: string };
  featured: boolean;
  order: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  category: { type: String, required: false, default: "" },
  image: { type: String, required: true },
  link: { type: String, required: false, default: "" },
  stats: {
    likes: { type: String, default: '0' },
    views: { type: String, default: '0' },
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Force clear the model from cache in development to ensure schema changes are picked up
if (process.env.NODE_ENV === 'development') {
  delete (models as Record<string, unknown>).Project;
}

const Project = models.Project || model<IProject>('Project', ProjectSchema);
export default Project;
