import { Schema, Document, models, model } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  role: string;
  brand: string;
  text: string;
  avatar: string;
  workImage: string;
  metric: string;
  rating: number;
  order: number;
}

const FeedbackSchema = new Schema<IFeedback>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  brand: { type: String },
  text: { type: String, required: true },
  avatar: { type: String },
  workImage: { type: String },
  metric: { type: String },
  rating: { type: Number, default: 5 },
  order: { type: Number, default: 0 },
});

export default models.Feedback || model<IFeedback>('Feedback', FeedbackSchema);
