import mongoose, { Schema, Document } from 'mongoose';

export interface IGovernmentScheme extends Document {
  title: string;
  category: string; // e.g. "Subsidy", "Insurance", "Credit", "Soil & Seed"
  description: string;
  eligibility: string[];
  benefits: string;
  documentsRequired: string[];
  applicationUrl: string;
  officialSource: string;
  lastVerifiedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GovernmentSchemeSchema: Schema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    eligibility: [{ type: String }],
    benefits: { type: String, required: true },
    documentsRequired: [{ type: String }],
    applicationUrl: { type: String, required: true },
    officialSource: { type: String, required: true },
    lastVerifiedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const GovernmentScheme = mongoose.model<IGovernmentScheme>('GovernmentScheme', GovernmentSchemeSchema);
