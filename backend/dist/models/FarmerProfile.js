import mongoose, { Schema } from 'mongoose';
const FarmerProfileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmName: { type: String, required: true, trim: true },
    farmSize: { type: Number, required: true },
    sizeUnit: { type: String, enum: ['ACRES', 'HECTARES', 'BIGHA'], default: 'ACRES' },
    soilType: {
        type: String,
        enum: ['ALLUVIAL', 'BLACK', 'RED', 'CLAY', 'SANDY', 'LOAM'],
        required: true,
    },
    soilPh: { type: Number, default: 6.5 },
    nitrogen: { type: Number, default: 140 },
    phosphorus: { type: Number, default: 40 },
    potassium: { type: Number, default: 40 },
    irrigationMethod: {
        type: String,
        enum: ['DRIP', 'CANAL', 'BOREWELL', 'RAIN', 'SPRINKLER'],
        required: true,
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    village: { type: String, required: true },
    pincode: { type: String, required: true },
    geoCoordinates: {
        lat: { type: Number },
        lng: { type: Number },
    },
    cropsGrown: [{ type: String }],
    farmingExperienceYears: { type: Number, default: 5 },
    aadhaarMasked: { type: String, default: 'XXXX-XXXX-1234' },
    farmImages: [{ type: String }],
}, { timestamps: true });
FarmerProfileSchema.index({ district: 1, state: 1, soilType: 1 });
export const FarmerProfile = mongoose.model('FarmerProfile', FarmerProfileSchema);
