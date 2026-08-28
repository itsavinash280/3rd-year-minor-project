import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    firebaseUid: { type: String, sparse: true, index: true },
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
}, { timestamps: true });
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ firebaseUid: 1 });
export const User = mongoose.model('User', UserSchema);
