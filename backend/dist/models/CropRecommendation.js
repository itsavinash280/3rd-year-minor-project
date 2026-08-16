import mongoose, { Schema } from 'mongoose';
const CropRecommendationSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
            suitabilityScore: { type: Number, required: true },
            expectedYieldPerAcre: { type: String, required: true },
            growingDurationDays: { type: Number, required: true },
            waterRequirement: { type: String, required: true },
            fertilizerGuide: { type: String, required: true },
            riskFactor: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
            explanation: { type: String, required: true },
        },
    ],
}, { timestamps: true });
export const CropRecommendation = mongoose.model('CropRecommendation', CropRecommendationSchema);
