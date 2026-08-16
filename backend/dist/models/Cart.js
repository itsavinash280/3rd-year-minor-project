import mongoose, { Schema } from 'mongoose';
const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
        {
            listingId: { type: Schema.Types.ObjectId, ref: 'CropListing', required: true },
            quantity: { type: Number, required: true, min: 1 },
            pricePerUnit: { type: Number, required: true },
        },
    ],
}, { timestamps: true });
export const Cart = mongoose.model('Cart', CartSchema);
