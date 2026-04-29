import { Schema, Document, models, model } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  image: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
});

// Aggressive model reload for development
if (process.env.NODE_ENV === 'development') {
  delete (models as Record<string, unknown>).Skill;
}

export default models.Skill || model<ISkill>('Skill', SkillSchema);
