import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'ORDER' | 'PAYMENT' | 'PRICE_ALERT' | 'EXPERT_REPLY' | 'RECOMMENDATION' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
