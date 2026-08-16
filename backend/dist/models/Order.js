import mongoose, { Schema } from 'mongoose';
const OrderSchema = new Schema({
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
        {
            listingId: { type: Schema.Types.ObjectId, ref: 'CropListing', required: true },
            title: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true },
            pricePerUnit: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    couponCode: { type: String },
    deliveryAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        village: { type: String, required: true },
        district: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING',
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
        default: 'PENDING',
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'CARD', 'NET_BANKING', 'COD'],
        default: 'UPI',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    trackingNumber: { type: String, required: true, unique: true },
    invoiceUrl: { type: String },
    deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    estimatedDeliveryDate: { type: Date, default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) },
}, { timestamps: true });
OrderSchema.index({ buyerId: 1, sellerId: 1, orderStatus: 1, createdAt: -1 });
export const Order = mongoose.model('Order', OrderSchema);
