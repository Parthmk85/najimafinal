import { Schema, Document, models, model } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  short: string;
  year: string;
  status?: string;
  statusType: 'done' | 'current' | 'future';
  icon: string;
  schoolName: string;
  schoolShort: string;
  location: string;
  order: number;
}

const EducationSchema = new Schema<IEducation>({
  degree: { type: String, required: true },
  short: { type: String, required: true },
  year: { type: String, required: true },
  status: { type: String },
  statusType: { type: String, enum: ['done', 'current', 'future'], default: 'done' },
  icon: { type: String, required: true },
  schoolName: { type: String, required: true },
  schoolShort: { type: String, required: true },
  location: { type: String, required: true },
  order: { type: Number, default: 0 },
});

export default models.Education || model<IEducation>('Education', EducationSchema);
