import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  listings: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    listings: [{ type: Schema.Types.ObjectId, ref: 'CropListing' }],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema);
