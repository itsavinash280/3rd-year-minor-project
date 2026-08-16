import mongoose, { Schema } from 'mongoose';
const ComplaintSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    category: { type: String, enum: ['ORDER', 'PAYMENT', 'QUALITY', 'DELIVERY', 'OTHER'], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'], default: 'PENDING' },
    adminNotes: { type: String },
}, { timestamps: true });
export const Complaint = mongoose.model('Complaint', ComplaintSchema);
