import mongoose, { Schema } from 'mongoose';
const DiseaseDetectionSchema = new Schema({
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
        default: 'This AI diagnostic result is informational. Consult an authorized agricultural specialist before applying chemical treatments.',
    },
}, { timestamps: true });
export const DiseaseDetection = mongoose.model('DiseaseDetection', DiseaseDetectionSchema);
