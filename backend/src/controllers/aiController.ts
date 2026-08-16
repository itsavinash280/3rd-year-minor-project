import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { CropRecommendationEngine } from '../ai/cropRecommendationService.js';
import { DiseaseDetectionEngine } from '../ai/diseaseDetectionService.js';
import { PricePredictionEngine } from '../ai/pricePredictionService.js';
import { VoiceAssistantEngine } from '../ai/voiceAssistantService.js';

import { CropRecommendation } from '../models/CropRecommendation.js';
import { DiseaseDetection } from '../models/DiseaseDetection.js';
import { PricePrediction } from '../models/PricePrediction.js';
import { VoiceConversation } from '../models/VoiceConversation.js';
import { FarmerProfile } from '../models/FarmerProfile.js';

export const recommendCrops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { soilType, soilPh, nitrogen, phosphorus, potassium, temperature, rainfall, humidity, season, irrigationMethod, farmSize } = req.body;

    const input = {
      soilType: soilType || 'ALLUVIAL',
      soilPh: soilPh ? Number(soilPh) : 6.8,
      nitrogen: nitrogen ? Number(nitrogen) : 140,
      phosphorus: phosphorus ? Number(phosphorus) : 45,
      potassium: potassium ? Number(potassium) : 40,
      temperature: temperature ? Number(temperature) : 26,
      rainfall: rainfall ? Number(rainfall) : 650,
      humidity: humidity ? Number(humidity) : 60,
      season: season || 'Kharif',
      irrigationMethod: irrigationMethod || 'CANAL',
      farmSize: farmSize ? Number(farmSize) : 5,
    };

    const recommendations = CropRecommendationEngine.recommendCrops(input);

    if (req.user) {
      await CropRecommendation.create({
        farmerId: req.user._id,
        ...input,
        recommendations,
      });
    }

    res.status(200).json({
      success: true,
      message: 'AI Crop Recommendations Generated!',
      input,
      recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCropRecommendationHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const history = await CropRecommendation.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const detectDisease = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { imageUrl, cropHint } = req.body;
    const sampleImage = imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19657?auto=format&fit=crop&w=800&q=80';

    const result = DiseaseDetectionEngine.analyzeImage(sampleImage, cropHint);

    let savedRecord = null;
    if (req.user) {
      savedRecord = await DiseaseDetection.create({
        farmerId: req.user._id,
        imageUrl: sampleImage,
        cropName: result.cropName,
        predictedDisease: result.predictedDisease,
        confidenceScore: result.confidenceScore,
        severity: result.severity,
        symptoms: result.symptoms,
        treatments: result.treatments,
        prevention: result.prevention,
        disclaimer: result.disclaimer,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Leaf Disease Scan Complete!',
      result,
      recordId: savedRecord?._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDiseaseHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) return;
    const history = await DiseaseDetection.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const predictCropPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cropName = 'Wheat', marketLocation = 'Lucknow APMC' } = req.body;
    const prediction = PricePredictionEngine.predictCropPrice(cropName, marketLocation);

    res.status(200).json({
      success: true,
      prediction,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const processVoiceQuery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { transcription, language = 'hi' } = req.body;

    if (!transcription) {
      res.status(400).json({ success: false, message: 'Transcription input required.' });
      return;
    }

    let farmerCtx;
    if (req.user) {
      const profile = await FarmerProfile.findOne({ userId: req.user._id });
      if (profile) {
        farmerCtx = {
          farmName: profile.farmName,
          soilType: profile.soilType,
          cropsGrown: profile.cropsGrown,
          district: profile.district,
          state: profile.state,
        };
      }
    }

    const response = VoiceAssistantEngine.processVoiceQuery({
      transcription,
      language,
      farmerProfileContext: farmerCtx,
    });

    if (req.user) {
      await VoiceConversation.create({
        userId: req.user._id,
        transcription,
        detectedIntent: response.detectedIntent,
        language: response.language as any,
        responseText: response.responseText,
        actionTaken: response.suggestedActions?.[0]?.link,
      });
    }

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
