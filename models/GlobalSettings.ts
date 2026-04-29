import { Schema, Document, models, model } from 'mongoose';

export interface IGlobalSettings extends Document {
  heroTitle: string;
  heroSubTitle: string;
  heroDescription: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  socials: { platform: string; url: string }[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  aboutImage: string;
  languages: string;
  heroBadgeText: string;
  heroBadgeShow: boolean;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>({
  heroTitle: { type: String, default: '' },
  heroSubTitle: { type: String, default: '' },
  heroDescription: { type: String, default: '' },
  heroImage: { type: String, default: '' },
  stats: [
    { label: { type: String }, value: { type: String } }
  ],
  socials: [
    { platform: { type: String }, url: { type: String } }
  ],
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  contactAddress: { type: String, default: '' },
  aboutImage: { type: String, default: '' },
  languages: { type: String, default: '' },
  heroBadgeText: { type: String, default: '' },
  heroBadgeShow: { type: Boolean, default: false },
});

export default models.GlobalSettings || model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
