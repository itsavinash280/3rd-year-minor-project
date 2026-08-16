import mongoose, { Schema, Document } from 'mongoose';

export interface IExpertConsultation extends Document {
  farmerId: mongoose.Types.ObjectId;
  expertId?: mongoose.Types.ObjectId;
  diseaseDetectionId?: mongoose.Types.ObjectId;
  subject: string;
  question: string;
  images: string[];
  response?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'ANSWERED' | 'CLOSED';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExpertConsultationSchema: Schema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    diseaseDetectionId: { type: Schema.Types.ObjectId, ref: 'DiseaseDetection' },
    subject: { type: String, required: true },
    question: { type: String, required: true },
    images: [{ type: String }],
    response: { type: String },
    status: { type: String, enum: ['OPEN', 'IN_REVIEW', 'ANSWERED', 'CLOSED'], default: 'OPEN' },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export const ExpertConsultation = mongoose.model<IExpertConsultation>(
  'ExpertConsultation',
  ExpertConsultationSchema
);
