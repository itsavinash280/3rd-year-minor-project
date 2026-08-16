# Requirements Traceability Matrix (FR-001 to FR-060+)

| Requirement ID | Description | Backend API | Frontend Screen | Database Model | Status |
|---|---|---|---|---|---|
| **FR-001** | User Registration (Email/Phone/Password) | `POST /api/auth/register` | `/register` | `User` | **IMPLEMENTED** |
| **FR-002** | OTP Verification | `POST /api/auth/verify-otp` | `/verify-otp` | `User` | **IMPLEMENTED** |
| **FR-003** | Google OAuth Authentication | `POST /api/auth/google` | `/login` | `User` | **IMPLEMENTED** |
| **FR-004** | Email / Phone Verification | `POST /api/auth/verify-otp` | `/verify-otp` | `User` | **IMPLEMENTED** |
| **FR-005** | BCrypt Password Hashing | `authController.ts` | `/register` | `User.password` | **IMPLEMENTED** |
| **FR-006** | Secure Login & Token Delivery | `POST /api/auth/login` | `/login` | `User` | **IMPLEMENTED** |
| **FR-007** | Forgot / Reset Password | `POST /api/auth/login` | `/login` | `User` | **IMPLEMENTED** |
| **FR-008** | JWT-based Token Authentication | `authMiddleware.ts` | All API calls | `User` | **IMPLEMENTED** |
| **FR-009** | Automatic Session Expiration | `authMiddleware.ts` | Global Context | `User` | **IMPLEMENTED** |
| **FR-010** | Multi-Device Session Management | `GET/DELETE /api/auth/sessions` | `/profile` | `User.activeSessions` | **IMPLEMENTED** |
| **FR-011** | Farmer Profile & Land Data | `POST /api/farms` | `/profile` | `FarmerProfile` | **IMPLEMENTED** |
| **FR-012** | Masked Aadhaar Privacy Protection | `farmController.ts` | `/profile` | `FarmerProfile.aadhaarMasked` | **IMPLEMENTED** |
| **FR-013** | Farm Image Upload | `uploadMiddleware.ts` | `/profile` | `FarmerProfile.farmImages` | **IMPLEMENTED** |
| **FR-014** | Edit Farm Profile | `PUT /api/farms` | `/profile` | `FarmerProfile` | **IMPLEMENTED** |
| **FR-015** | Profile Deletion & Anonymization | `DELETE /api/farms` | `/profile` | `FarmerProfile` | **IMPLEMENTED** |
| **FR-016** | Create Crop Listing | `POST /api/marketplace` | `/marketplace` | `CropListing` | **IMPLEMENTED** |
| **FR-017** | Edit Crop Listing | `PUT /api/marketplace/:id` | `/marketplace` | `CropListing` | **IMPLEMENTED** |
| **FR-018** | Deactivate Crop Listing | `DELETE /api/marketplace/:id` | `/marketplace` | `CropListing` | **IMPLEMENTED** |
| **FR-019** | Search & Filter Marketplace | `GET /api/marketplace` | `/marketplace` | `CropListing` | **IMPLEMENTED** |
| **FR-020** | Geolocation Discovery | `marketplaceController.ts` | `/marketplace` | `CropListing.location` | **IMPLEMENTED** |
| **FR-021** | Wishlist Management | `GET/POST /api/marketplace/user/wishlist` | `/marketplace` | `Wishlist` | **IMPLEMENTED** |
| **FR-022** | Shopping Cart System | `GET/POST /api/marketplace/user/cart` | `/cart` | `Cart` | **IMPLEMENTED** |
| **FR-023** | Secure Checkout & Escrow | `POST /api/orders` | `/checkout` | `Order` | **IMPLEMENTED** |
| **FR-024** | Coupon Verification System | `POST /api/marketplace/coupons/verify` | `/cart`, `/checkout` | `Coupon` | **IMPLEMENTED** |
| **FR-025** | Invoice PDF Generation | `/orders` PDF export | `/orders` | `Order.invoiceUrl` | **IMPLEMENTED** |
| **FR-026** | AI Soil/Climate Crop Recommendation | `POST /api/ai/crop-recommendation` | `/crop-recommendation` | `CropRecommendation` | **IMPLEMENTED** |
| **FR-027** | Explainable Agronomy Reasoning | `cropRecommendationEngine.ts` | `/crop-recommendation` | `CropRecommendation.explanation` | **IMPLEMENTED** |
| **FR-028** | Downloadable Recommendation Report | Browser PDF Print | `/crop-recommendation` | `CropRecommendation` | **IMPLEMENTED** |
| **FR-029** | Save AI Recommendations | `aiController.ts` | `/crop-recommendation` | `CropRecommendation` | **IMPLEMENTED** |
| **FR-030** | Recommendation History | `GET /api/ai/crop-recommendation/history` | `/crop-recommendation` | `CropRecommendation` | **IMPLEMENTED** |
| **FR-031** | Leaf Image Upload & Camera Capture | `uploadMiddleware.ts` | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-032** | CNN Image Classification Model | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-033** | Disease Name & Crop Association | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-034** | Confidence Score & Low Warning | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-035** | Product & Medicine Info | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection.treatments` | **IMPLEMENTED** |
| **FR-036** | Chemical & Organic Treatment Guidance | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection.treatments` | **IMPLEMENTED** |
| **FR-037** | Safety & Medical Disclaimer | `diseaseDetectionEngine.ts` | `/disease-detection` | `DiseaseDetection.disclaimer` | **IMPLEMENTED** |
| **FR-038** | Request Expert Consultation Escalation | `POST /api/experts/consultations` | `/expert-consultation` | `ExpertConsultation` | **IMPLEMENTED** |
| **FR-039** | Downloadable Disease Report | Browser PDF Print | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-040** | Disease Detection History | `GET /api/ai/disease-detection/history` | `/disease-detection` | `DiseaseDetection` | **IMPLEMENTED** |
| **FR-041** | Historical Mandi Price Analysis | `pricePredictionEngine.ts` | `/price-prediction` | `PricePrediction` | **IMPLEMENTED** |
| **FR-042** | Demand & Supply Forecasting | `pricePredictionEngine.ts` | `/price-prediction` | `PricePrediction` | **IMPLEMENTED** |
| **FR-044** | Recharts 6-Month Price Graph | `PricePredictionPage.tsx` | `/price-prediction` | `PricePrediction.forecast` | **IMPLEMENTED** |
| **FR-045** | Optimal Selling Period Guidance | `pricePredictionEngine.ts` | `/price-prediction` | `PricePrediction.bestSellingPeriod` | **IMPLEMENTED** |
| **FR-046** | Price Volatility Risk Analysis | `pricePredictionEngine.ts` | `/price-prediction` | `PricePrediction.riskLevel` | **IMPLEMENTED** |
| **FR-047** | Export Price Report as PDF | Browser PDF Print | `/price-prediction` | `PricePrediction` | **IMPLEMENTED** |
| **FR-048** | Multi-Mandi Comparison (Lucknow/Delhi/Kanpur) | `pricePredictionEngine.ts` | `/price-prediction` | `MarketPrice` | **IMPLEMENTED** |
| **FR-049** | Price Threshold Alert System | Local Alert State / Modal | `/price-prediction` | `Notification` | **IMPLEMENTED** |
| **FR-050** | Prediction History | `aiController.ts` | `/price-prediction` | `PricePrediction` | **IMPLEMENTED** |
| **FR-051** | Multilingual STT / TTS Voice Engine | `VoiceAssistantContext.tsx` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-052** | Web Speech Trigger Architecture | `VoiceAssistantModal.tsx` | Global Navbar | `VoiceConversation` | **IMPLEMENTED** |
| **FR-053** | Voice Crop Recommendation Query | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-054** | Voice Disease Guidance Query | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-055** | Voice Weather Queries | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-056** | Voice Order Tracking Queries | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-057** | Voice Marketplace Search | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-058** | Government Scheme Voice Queries | `voiceAssistantEngine.ts` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-059** | Voice Conversation History | `VoiceAssistantContext.tsx` | Voice Modal | `VoiceConversation` | **IMPLEMENTED** |
| **FR-060** | Context-Aware Voice Personalization | `voiceAssistantEngine.ts` | Voice Modal | `FarmerProfile` | **IMPLEMENTED** |
