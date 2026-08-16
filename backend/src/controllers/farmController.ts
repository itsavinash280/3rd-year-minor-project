import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { FarmerProfile } from '../models/FarmerProfile.js';

export const getFarmProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const profile = await FarmerProfile.findOne({ userId: req.user._id });
    res.status(200).json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateFarmProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const {
      farmName,
      farmSize,
      sizeUnit,
      soilType,
      soilPh,
      nitrogen,
      phosphorus,
      potassium,
      irrigationMethod,
      state,
      district,
      village,
      pincode,
      cropsGrown,
      farmingExperienceYears,
      aadhaarMasked,
      farmImages,
    } = req.body;

    let profile = await FarmerProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile.farmName = farmName || profile.farmName;
      profile.farmSize = farmSize || profile.farmSize;
      profile.sizeUnit = sizeUnit || profile.sizeUnit;
      profile.soilType = soilType || profile.soilType;
      profile.soilPh = soilPh || profile.soilPh;
      profile.nitrogen = nitrogen || profile.nitrogen;
      profile.phosphorus = phosphorus || profile.phosphorus;
      profile.potassium = potassium || profile.potassium;
      profile.irrigationMethod = irrigationMethod || profile.irrigationMethod;
      profile.state = state || profile.state;
      profile.district = district || profile.district;
      profile.village = village || profile.village;
      profile.pincode = pincode || profile.pincode;
      profile.cropsGrown = cropsGrown || profile.cropsGrown;
      profile.farmingExperienceYears = farmingExperienceYears || profile.farmingExperienceYears;
      if (aadhaarMasked) profile.aadhaarMasked = aadhaarMasked;
      if (farmImages) profile.farmImages = farmImages;

      await profile.save();
      res.status(200).json({ success: true, message: 'Farm profile updated successfully!', profile });
    } else {
      profile = await FarmerProfile.create({
        userId: req.user._id,
        farmName: farmName || `${req.user.name}'s Organic Farm`,
        farmSize: farmSize || 5,
        sizeUnit: sizeUnit || 'ACRES',
        soilType: soilType || 'ALLUVIAL',
        soilPh: soilPh || 6.8,
        nitrogen: nitrogen || 140,
        phosphorus: phosphorus || 45,
        potassium: potassium || 40,
        irrigationMethod: irrigationMethod || 'CANAL',
        state: state || 'Uttar Pradesh',
        district: district || 'Lucknow',
        village: village || 'Malihabad',
        pincode: pincode || '226101',
        cropsGrown: cropsGrown || ['Wheat', 'Paddy', 'Mustard'],
        farmingExperienceYears: farmingExperienceYears || 8,
        aadhaarMasked: aadhaarMasked || 'XXXX-XXXX-9876',
        farmImages: farmImages || ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
      });
      res.status(201).json({ success: true, message: 'Farm profile created successfully!', profile });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
