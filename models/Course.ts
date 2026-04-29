import { Schema, Document, models, model } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  image: string;
  order: number;
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default models.Course || model<ICourse>('Course', CourseSchema);
