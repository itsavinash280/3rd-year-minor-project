import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'FARMER' | 'BUYER' | 'EXPERT' | 'TRANSPORT' | 'ADMIN';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  googleId?: string;
  avatar?: string;
  activeSessions: {
    sessionId: string;
    deviceInfo: string;
    lastActive: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['FARMER', 'BUYER', 'EXPERT', 'TRANSPORT', 'ADMIN'],
      default: 'FARMER',
      required: true,
    },
    isVerified: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
    activeSessions: [
      {
        sessionId: { type: String, required: true },
        deviceInfo: { type: String, required: true },
        lastActive: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);


