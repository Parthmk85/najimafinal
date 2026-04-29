import { Schema, Document, models, model } from 'mongoose';

export interface IService extends Document {
  title: string;
  icon: string; // Key for the icon map
  num: string;  // Ghost number (e.g. 01)
  description?: string;
  isFeatured: boolean;
  tag?: string; // e.g. "Most Popular"
  order: number;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  icon: { type: String, required: true },
  num: { type: String, required: true },
  description: { type: String },
  isFeatured: { type: Boolean, default: false },
  tag: { type: String },
  order: { type: Number, default: 0 },
});

export default models.Service || model<IService>('Service', ServiceSchema);
