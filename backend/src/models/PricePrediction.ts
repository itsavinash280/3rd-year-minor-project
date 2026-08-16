import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceForecastItem {
  month: string;
  predictedPrice: number;
  lowBound: number;
  highBound: number;
}

export interface IPricePrediction extends Document {
  cropName: string;
  marketLocation: string;
  state: string;
  currentPrice: number;
  forecast: IPriceForecastItem[];
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  bestSellingPeriod: string;
  insights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PricePredictionSchema: Schema = new Schema(
  {
    cropName: { type: String, required: true, index: true },
    marketLocation: { type: String, required: true },
    state: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    forecast: [
      {
        month: { type: String, required: true },
        predictedPrice: { type: Number, required: true },
        lowBound: { type: Number, required: true },
        highBound: { type: Number, required: true },
      },
    ],
    trend: { type: String, enum: ['UP', 'DOWN', 'STABLE'], default: 'UP' },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    bestSellingPeriod: { type: String, required: true },
    insights: [{ type: String }],
  },
  { timestamps: true }
);

export const PricePrediction = mongoose.model<IPricePrediction>('PricePrediction', PricePredictionSchema);
