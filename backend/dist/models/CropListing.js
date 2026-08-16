import mongoose, { Schema } from 'mongoose';
const CropListingSchema = new Schema({
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    cropCategory: { type: String, required: true, index: true },
    variety: { type: String, required: true },
    quantityAvailable: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ['KG', 'QUINTAL', 'TON', 'BOX', 'BAG'], default: 'QUINTAL' },
    pricePerUnit: { type: Number, required: true, min: 0 },
    minOrderQuantity: { type: Number, default: 1 },
    isOrganic: { type: Boolean, default: false },
    harvestDate: { type: Date, default: Date.now },
    description: { type: String, required: true },
    images: [{ type: String }],
    location: {
        village: { type: String, required: true },
        district: { type: String, required: true, index: true },
        state: { type: String, required: true, index: true },
        lat: { type: Number },
        lng: { type: Number },
    },
    status: { type: String, enum: ['AVAILABLE', 'SOLD_OUT', 'INACTIVE'], default: 'AVAILABLE' },
    rating: { type: Number, default: 4.5 },
    totalReviews: { type: Number, default: 12 },
}, { timestamps: true });
CropListingSchema.index({ cropCategory: 1, pricePerUnit: 1, 'location.district': 1, 'location.state': 1, status: 1 });
export const CropListing = mongoose.model('CropListing', CropListingSchema);
