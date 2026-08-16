export type UserRole = 'FARMER' | 'BUYER' | 'EXPERT' | 'TRANSPORT' | 'ADMIN';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
}

export interface FarmerProfile {
  _id?: string;
  userId: string;
  farmName: string;
  farmSize: number;
  sizeUnit: 'ACRES' | 'HECTARES' | 'BIGHA';
  soilType: 'ALLUVIAL' | 'BLACK' | 'RED' | 'CLAY' | 'SANDY' | 'LOAM';
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  irrigationMethod: 'DRIP' | 'CANAL' | 'BOREWELL' | 'RAIN' | 'SPRINKLER';
  state: string;
  district: string;
  village: string;
  pincode: string;
  cropsGrown: string[];
  farmingExperienceYears: number;
  aadhaarMasked?: string;
  farmImages?: string[];
}

export interface CropListing {
  _id: string;
  sellerId: {
    _id: string;
    name: string;
    phone: string;
    avatar?: string;
    rating?: number;
  } | string;
  title: string;
  cropCategory: string;
  variety: string;
  quantityAvailable: number;
  unit: 'KG' | 'QUINTAL' | 'TON' | 'BOX' | 'BAG';
  pricePerUnit: number;
  minOrderQuantity: number;
  isOrganic: boolean;
  harvestDate: string;
  description: string;
  images: string[];
  location: {
    village: string;
    district: string;
    state: string;
  };
  status: 'AVAILABLE' | 'SOLD_OUT' | 'INACTIVE';
  rating: number;
  totalReviews: number;
}

export interface CartItem {
  listingId: CropListing;
  quantity: number;
  pricePerUnit: number;
}

export interface OrderItem {
  listingId: string;
  title: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  buyerId: User | string;
  sellerId: User | string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
  };
  orderStatus: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';
  razorpayOrderId?: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface RecommendedCropItem {
  cropName: string;
  suitabilityScore: number;
  expectedYieldPerAcre: string;
  growingDurationDays: number;
  waterRequirement: string;
  fertilizerGuide: string;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

export interface DiseaseDetectionResult {
  cropName: string;
  predictedDisease: string;
  confidenceScore: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  symptoms: string[];
  treatments: {
    chemical: string[];
    organic: string[];
    dosageInfo: string;
  };
  prevention: string[];
  disclaimer: string;
  expertEscalationRecommended: boolean;
}

export interface PriceForecastItem {
  month: string;
  predictedPrice: number;
  lowBound: number;
  highBound: number;
}

export interface MarketPriceComparison {
  mandi: string;
  district: string;
  state: string;
  currentModalPrice: number;
  distanceKm: number;
  demandStatus: 'HIGH' | 'MODERATE' | 'NORMAL';
}

export interface PricePredictionResult {
  cropName: string;
  primaryMarket: string;
  currentPrice: number;
  unit: string;
  forecast: PriceForecastItem[];
  trend: 'UP' | 'DOWN' | 'STABLE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  bestSellingPeriod: string;
  insights: string[];
  marketComparisons: MarketPriceComparison[];
}

export interface GovernmentScheme {
  _id: string;
  title: string;
  category: string;
  description: string;
  eligibility: string[];
  benefits: string;
  documentsRequired: string[];
  applicationUrl: string;
  officialSource: string;
  lastVerifiedDate: string;
}

export interface ExpertConsultation {
  _id: string;
  farmerId: User;
  expertId?: User;
  subject: string;
  question: string;
  images: string[];
  response?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'ANSWERED' | 'CLOSED';
  createdAt: string;
}
