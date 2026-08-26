import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendedCropItem {
  cropName: string;
  category?: 'AGRICULTURAL' | 'HORTICULTURAL' | 'MIXED';
  suitabilityScore: number; // 0-100
  expectedYieldPerAcre: string;
  growingDurationDays: number;
  waterRequirement: string;
  fertilizerGuide: string;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
  optimalNPK?: { n: number; p: number; k: number; ph: number };
}

export interface ICropRecommendation extends Document {
  farmerId: mongoose.Types.ObjectId;
  category?: string;
  modelAlgorithm?: string;
  soilType: string;
  soilPh?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  temperature: number;
  rainfall: number;
  humidity: number;
  season: string;
  irrigationMethod: string;
  farmSize: number;
  recommendations: IRecommendedCropItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CropRecommendationSchema: Schema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: ['AGRICULTURAL', 'HORTICULTURAL', 'ALL'], default: 'ALL' },
    modelAlgorithm: { type: String, default: 'XGBoost (Heliyon 2024)' },
    soilType: { type: String, required: true },
    soilPh: { type: Number },
    nitrogen: { type: Number },
    phosphorus: { type: Number },
    potassium: { type: Number },
    temperature: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    humidity: { type: Number, required: true },
    season: { type: String, required: true },
    irrigationMethod: { type: String, required: true },
    farmSize: { type: Number, required: true },
    recommendations: [
      {
        cropName: { type: String, required: true },
        category: { type: String },
        suitabilityScore: { type: Number, required: true },
        expectedYieldPerAcre: { type: String, required: true },
        growingDurationDays: { type: Number, required: true },
        waterRequirement: { type: String, required: true },
        fertilizerGuide: { type: String, required: true },
        riskFactor: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
        explanation: { type: String, required: true },
        optimalNPK: {
          n: Number,
          p: Number,
          k: Number,
          ph: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export const CropRecommendation = mongoose.model<ICropRecommendation>(
  'CropRecommendation',
  CropRecommendationSchema
);
