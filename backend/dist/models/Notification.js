import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['ORDER', 'PAYMENT', 'PRICE_ALERT', 'EXPERT_REPLY', 'RECOMMENDATION', 'SYSTEM'],
        default: 'SYSTEM',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
}, { timestamps: true });
export const Notification = mongoose.model('Notification', NotificationSchema);
