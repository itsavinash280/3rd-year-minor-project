import mongoose, { Schema } from 'mongoose';
const CouponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    maxDiscountAmount: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const Coupon = mongoose.model('Coupon', CouponSchema);
