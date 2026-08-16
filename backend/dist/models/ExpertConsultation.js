import mongoose, { Schema } from 'mongoose';
const ExpertConsultationSchema = new Schema({
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    diseaseDetectionId: { type: Schema.Types.ObjectId, ref: 'DiseaseDetection' },
    subject: { type: String, required: true },
    question: { type: String, required: true },
    images: [{ type: String }],
    response: { type: String },
    status: { type: String, enum: ['OPEN', 'IN_REVIEW', 'ANSWERED', 'CLOSED'], default: 'OPEN' },
    rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });
export const ExpertConsultation = mongoose.model('ExpertConsultation', ExpertConsultationSchema);
