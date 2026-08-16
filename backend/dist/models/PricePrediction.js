import mongoose, { Schema } from 'mongoose';
const PricePredictionSchema = new Schema({
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
}, { timestamps: true });
export const PricePrediction = mongoose.model('PricePrediction', PricePredictionSchema);
