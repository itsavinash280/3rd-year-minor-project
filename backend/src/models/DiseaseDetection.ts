import mongoose, { Schema, Document } from 'mongoose';

export interface IDiseaseDetection extends Document {
  farmerId: mongoose.Types.ObjectId;
  imageUrl: string;
  cropName: string;
  predictedDisease: string;
  confidenceScore: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  symptoms: string[];
  treatments: {
    chemical: string[];
    organic: string[];
    dosageInfo: string;
  };
  prevention: string[];
  expertVerified: boolean;
  expertNotes?: string;
  disclaimer: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseDetectionSchema: Schema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    imageUrl: { type: String, required: true },
    cropName: { type: String, required: true },
    predictedDisease: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    severity: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'MODERATE' },
    symptoms: [{ type: String }],
    treatments: {
      chemical: [{ type: String }],
      organic: [{ type: String }],
      dosageInfo: { type: String },
    },
    prevention: [{ type: String }],
    expertVerified: { type: Boolean, default: false },
    expertNotes: { type: String },
    disclaimer: {
      type: String,
      default:
        'This AI diagnostic result is informational. Consult an authorized agricultural specialist before applying chemical treatments.',
    },
  },
  { timestamps: true }
);

export const DiseaseDetection = mongoose.model<IDiseaseDetection>('DiseaseDetection', DiseaseDetectionSchema);
