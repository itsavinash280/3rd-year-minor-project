import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  listingId: mongoose.Types.ObjectId;
  quantity: number;
  pricePerUnit: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        listingId: { type: Schema.Types.ObjectId, ref: 'CropListing', required: true },
        quantity: { type: Number, required: true, min: 1 },
        pricePerUnit: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
