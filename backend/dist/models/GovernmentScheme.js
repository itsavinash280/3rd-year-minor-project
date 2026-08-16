import mongoose, { Schema } from 'mongoose';
const GovernmentSchemeSchema = new Schema({
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    eligibility: [{ type: String }],
    benefits: { type: String, required: true },
    documentsRequired: [{ type: String }],
    applicationUrl: { type: String, required: true },
    officialSource: { type: String, required: true },
    lastVerifiedDate: { type: Date, default: Date.now },
}, { timestamps: true });
export const GovernmentScheme = mongoose.model('GovernmentScheme', GovernmentSchemeSchema);
