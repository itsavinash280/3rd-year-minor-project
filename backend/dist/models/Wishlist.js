import mongoose, { Schema } from 'mongoose';
const WishlistSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    listings: [{ type: Schema.Types.ObjectId, ref: 'CropListing' }],
}, { timestamps: true });
export const Wishlist = mongoose.model('Wishlist', WishlistSchema);
