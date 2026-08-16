import mongoose, { Schema } from 'mongoose';
const DeliverySchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    transportPartnerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    pickupLocation: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        phone: { type: String, required: true },
    },
    dropLocation: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        phone: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ['ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        default: 'ASSIGNED',
    },
    statusHistory: [
        {
            status: { type: String, required: true },
            location: { type: String, required: true },
            note: { type: String },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    vehicleDetails: { type: String, default: 'Eicher 10.50 Agro Truck (UP-32-AB-9876)' },
    driverName: { type: String, default: 'Ramesh Transport Express' },
    driverPhone: { type: String, default: '+91 98765 43210' },
}, { timestamps: true });
export const Delivery = mongoose.model('Delivery', DeliverySchema);
