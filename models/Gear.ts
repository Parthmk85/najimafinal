import { Schema, Document, models, model } from 'mongoose';

export interface IGear extends Document {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  tags: string[];
  order: number;
}

const GearSchema = new Schema<IGear>({
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  tags: [{ type: String }],
  order: { type: Number, default: 0 },
});

export default models.Gear || model<IGear>('Gear', GearSchema);
