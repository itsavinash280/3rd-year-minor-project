import mongoose, { Schema } from 'mongoose';
const MarketPriceSchema = new Schema({
    cropName: { type: String, required: true, index: true },
    mandi: { type: String, required: true },
    district: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
MarketPriceSchema.index({ cropName: 1, district: 1, date: -1 });
export const MarketPrice = mongoose.model('MarketPrice', MarketPriceSchema);
