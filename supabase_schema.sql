-- ==============================================================================
-- AsraVerse AI — Supabase Complete Database Schema
-- Run this complete script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Custom ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('FARMER', 'BUYER', 'EXPERT', 'TRANSPORT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE crop_unit AS ENUM ('KG', 'QUINTAL', 'TON', 'BOX', 'BAG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('AVAILABLE', 'SOLD_OUT', 'INACTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('UPI', 'CARD', 'NET_BANKING', 'COD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE soil_type_enum AS ENUM ('ALLUVIAL', 'BLACK', 'RED', 'CLAY', 'SANDY', 'LOAM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE irrigation_method_enum AS ENUM ('DRIP', 'CANAL', 'BOREWELL', 'RAIN', 'SPRINKLER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disease_severity AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_status_enum AS ENUM ('ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_status AS ENUM ('OPEN', 'IN_REVIEW', 'ANSWERED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_category AS ENUM ('ORDER', 'PAYMENT', 'QUALITY', 'DELIVERY', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE complaint_status AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('ORDER', 'PAYMENT', 'PRICE_ALERT', 'EXPERT_REPLY', 'RECOMMENDATION', 'SYSTEM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE price_trend AS ENUM ('UP', 'DOWN', 'STABLE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Automatic Updated_At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLES DEFINITION
-- ==============================================================================

-- 4.1 Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role user_role NOT NULL DEFAULT 'FARMER',
    is_verified BOOLEAN DEFAULT TRUE,
    google_id VARCHAR(255),
    avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    active_sessions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_users_email_role ON public.users(email, role);

-- 4.2 Farmer Profiles Table
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    farm_size NUMERIC(10,2) NOT NULL,
    size_unit VARCHAR(50) DEFAULT 'ACRES',
    soil_type soil_type_enum NOT NULL DEFAULT 'ALLUVIAL',
    soil_ph NUMERIC(4,2) DEFAULT 6.5,
    nitrogen NUMERIC(8,2) DEFAULT 140,
    phosphorus NUMERIC(8,2) DEFAULT 40,
    potassium NUMERIC(8,2) DEFAULT 40,
    irrigation_method irrigation_method_enum NOT NULL DEFAULT 'BOREWELL',
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    geo_lat NUMERIC(10,6),
    geo_lng NUMERIC(10,6),
    crops_grown TEXT[] DEFAULT '{}',
    farming_experience_years INT DEFAULT 5,
    aadhaar_masked VARCHAR(50) DEFAULT 'XXXX-XXXX-1234',
    farm_images TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_farmer_profiles_updated_at BEFORE UPDATE ON public.farmer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_farmer_location ON public.farmer_profiles(district, state, soil_type);

-- 4.3 Crop Listings (Marketplace)
CREATE TABLE IF NOT EXISTS public.crop_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    crop_category VARCHAR(100) NOT NULL,
    variety VARCHAR(100) NOT NULL,
    quantity_available NUMERIC(12,2) NOT NULL CHECK (quantity_available >= 0),
    unit crop_unit NOT NULL DEFAULT 'QUINTAL',
    price_per_unit NUMERIC(12,2) NOT NULL CHECK (price_per_unit >= 0),
    min_order_quantity NUMERIC(12,2) DEFAULT 1,
    is_organic BOOLEAN DEFAULT FALSE,
    harvest_date DATE DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    village VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    geo_lat NUMERIC(10,6),
    geo_lng NUMERIC(10,6),
    status listing_status DEFAULT 'AVAILABLE',
    rating NUMERIC(3,2) DEFAULT 4.5,
    total_reviews INT DEFAULT 12,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_crop_listings_updated_at BEFORE UPDATE ON public.crop_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_crop_listings_filter ON public.crop_listings(crop_category, price_per_unit, district, state, status);

-- 4.4 Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL,
    coupon_code VARCHAR(50),
    delivery_full_name VARCHAR(255) NOT NULL,
    delivery_phone VARCHAR(50) NOT NULL,
    delivery_street VARCHAR(255) NOT NULL,
    delivery_village VARCHAR(100) NOT NULL,
    delivery_district VARCHAR(100) NOT NULL,
    delivery_state VARCHAR(100) NOT NULL,
    delivery_pincode VARCHAR(20) NOT NULL,
    order_status order_status DEFAULT 'PENDING',
    payment_status payment_status DEFAULT 'PENDING',
    payment_method payment_method DEFAULT 'UPI',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_url TEXT,
    delivery_partner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    estimated_delivery_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '4 days'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_orders_lookup ON public.orders(buyer_id, seller_id, order_status, created_at DESC);

-- 4.5 Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.crop_listings(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_per_unit NUMERIC(12,2) NOT NULL,
    total_price NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 4.6 Deliveries & Transport Table
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    transport_partner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    pickup_address TEXT NOT NULL,
    pickup_city VARCHAR(100) NOT NULL,
    pickup_state VARCHAR(100) NOT NULL,
    pickup_phone VARCHAR(50) NOT NULL,
    drop_address TEXT NOT NULL,
    drop_city VARCHAR(100) NOT NULL,
    drop_state VARCHAR(100) NOT NULL,
    drop_phone VARCHAR(50) NOT NULL,
    status delivery_status_enum DEFAULT 'ASSIGNED',
    status_history JSONB DEFAULT '[]'::jsonb,
    vehicle_details VARCHAR(255) DEFAULT 'Eicher 10.50 Agro Truck (UP-32-AB-9876)',
    driver_name VARCHAR(255) DEFAULT 'Ramesh Transport Express',
    driver_phone VARCHAR(50) DEFAULT '+91 98765 43210',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.7 AI Crop Recommendations Table
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'ALL',
    model_algorithm VARCHAR(100) DEFAULT 'XGBoost (Heliyon 2024)',
    soil_type VARCHAR(100) NOT NULL,
    soil_ph NUMERIC(4,2),
    nitrogen NUMERIC(8,2),
    phosphorus NUMERIC(8,2),
    potassium NUMERIC(8,2),
    temperature NUMERIC(6,2) NOT NULL,
    rainfall NUMERIC(8,2) NOT NULL,
    humidity NUMERIC(6,2) NOT NULL,
    season VARCHAR(50) NOT NULL,
    irrigation_method VARCHAR(100) NOT NULL,
    farm_size NUMERIC(8,2) NOT NULL,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_farmer ON public.crop_recommendations(farmer_id, created_at DESC);

-- 4.8 AI Disease Detection Scans Table
CREATE TABLE IF NOT EXISTS public.disease_detections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    predicted_disease VARCHAR(255) NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    severity disease_severity DEFAULT 'MODERATE',
    symptoms TEXT[] DEFAULT '{}',
    treatments JSONB DEFAULT '{"chemical": [], "organic": [], "dosageInfo": ""}'::jsonb,
    prevention TEXT[] DEFAULT '{}',
    expert_verified BOOLEAN DEFAULT FALSE,
    expert_notes TEXT,
    disclaimer TEXT DEFAULT 'This AI diagnostic result is informational. Consult an authorized agricultural specialist before applying chemical treatments.',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disease_farmer ON public.disease_detections(farmer_id, created_at DESC);

-- 4.9 Expert Consultations Table
CREATE TABLE IF NOT EXISTS public.expert_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expert_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    disease_detection_id UUID REFERENCES public.disease_detections(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    response TEXT,
    status consultation_status DEFAULT 'OPEN',
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultation_status ON public.expert_consultations(farmer_id, expert_id, status);

-- 4.10 Government Schemes Table
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT[] DEFAULT '{}',
    benefits TEXT NOT NULL,
    documents_required TEXT[] DEFAULT '{}',
    application_url TEXT NOT NULL,
    official_source VARCHAR(255) NOT NULL,
    last_verified_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.government_schemes(category);

-- 4.11 Real-Time Mandi Market Prices Table
CREATE TABLE IF NOT EXISTS public.market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    mandi VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    min_price NUMERIC(10,2) NOT NULL,
    max_price NUMERIC(10,2) NOT NULL,
    modal_price NUMERIC(10,2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_lookup ON public.market_prices(crop_name, district, date DESC);

-- 4.12 AI Price Predictions Table
CREATE TABLE IF NOT EXISTS public.price_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_name VARCHAR(100) NOT NULL,
    market_location VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    current_price NUMERIC(10,2) NOT NULL,
    forecast JSONB NOT NULL DEFAULT '[]'::jsonb,
    trend price_trend DEFAULT 'UP',
    risk_level risk_level DEFAULT 'LOW',
    best_selling_period VARCHAR(100) NOT NULL,
    insights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_predictions_crop ON public.price_predictions(crop_name);

-- 4.13 Shopping Cart Table
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.14 Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    listings UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.15 Coupons & Offers Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent NUMERIC(5,2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    max_discount_amount NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.16 Complaints & Support Tickets Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    category complaint_category NOT NULL,
    description TEXT NOT NULL,
    status complaint_status DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.17 Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);

-- 4.18 Multilingual Voice Assistant Conversations Table
CREATE TABLE IF NOT EXISTS public.voice_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transcription TEXT NOT NULL,
    detected_intent VARCHAR(255) NOT NULL,
    language VARCHAR(20) DEFAULT 'hi',
    response_text TEXT NOT NULL,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_user ON public.voice_conversations(user_id, created_at DESC);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_conversations ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for marketplace & informational items
CREATE POLICY "Public Read Crop Listings" ON public.crop_listings FOR SELECT USING (true);
CREATE POLICY "Public Read Schemes" ON public.government_schemes FOR SELECT USING (true);
CREATE POLICY "Public Read Market Prices" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Public Read Price Predictions" ON public.price_predictions FOR SELECT USING (true);
CREATE POLICY "Public Read Active Coupons" ON public.coupons FOR SELECT USING (is_active = true);

-- Authenticated User CRUD Policies
CREATE POLICY "Users can manage own profile" ON public.users FOR ALL USING (true);
CREATE POLICY "Farmers can manage own farm profile" ON public.farmer_profiles FOR ALL USING (true);
CREATE POLICY "Users can manage own listings" ON public.crop_listings FOR ALL USING (true);
CREATE POLICY "Users can manage own orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Users can view order items" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Users can view deliveries" ON public.deliveries FOR ALL USING (true);
CREATE POLICY "Farmers can view own crop recommendations" ON public.crop_recommendations FOR ALL USING (true);
CREATE POLICY "Farmers can view own disease scans" ON public.disease_detections FOR ALL USING (true);
CREATE POLICY "Users can access consultations" ON public.expert_consultations FOR ALL USING (true);
CREATE POLICY "Users can manage own cart" ON public.carts FOR ALL USING (true);
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL USING (true);
CREATE POLICY "Users can view own complaints" ON public.complaints FOR ALL USING (true);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR ALL USING (true);
CREATE POLICY "Users can view own voice logs" ON public.voice_conversations FOR ALL USING (true);

-- ==============================================================================
-- 6. SEED INITIAL NATIONAL DATA
-- ==============================================================================

-- Seed Government Schemes
INSERT INTO public.government_schemes (title, category, description, eligibility, benefits, documents_required, application_url, official_source)
VALUES 
(
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    'Direct Income Support',
    'Financial assistance of ₹6,000 per year in three equal 4-monthly installments of ₹2,000 to all landholding farmer families across India.',
    ARRAY['All landholding farmer families with cultivable land', 'Valid Aadhaar linked bank account', 'Active land ownership record'],
    '₹6,000 per annum direct cash transfer into bank account via DBT.',
    ARRAY['Aadhaar Card', 'Land Ownership Record (Khata/Khasra)', 'Bank Passbook Details', 'Mobile Number'],
    'https://pmkisan.gov.in',
    'Ministry of Agriculture & Farmers Welfare, Govt of India'
),
(
    'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    'Crop Insurance',
    'Comprehensive risk insurance coverage from pre-sowing to post-harvest against non-preventable natural risks, flood, drought, pests & disease.',
    ARRAY['All farmers growing notified crops in notified areas', 'Sharecroppers and tenant farmers eligible', 'Applicable for Kharif and Rabi seasons'],
    'Maximum 2% premium for Kharif crops, 1.5% for Rabi crops, 5% for commercial/horticultural crops; full claim payout.',
    ARRAY['Aadhaar Card', 'Land Sowing Certificate', 'Bank Account', 'Land Revenue Receipt'],
    'https://pmfby.gov.in',
    'Ministry of Agriculture & Farmers Welfare, Govt of India'
),
(
    'Soil Health Card Scheme',
    'Soil & Nutrient Management',
    'Periodic issuance of soil health cards providing 12 nutrient status indicators and tailored fertilizer recommendations for optimal yield.',
    ARRAY['All farmers in rural India across all states and union territories'],
    'Free scientific soil testing report with tailored NPK and micronutrient dosage advisory every 2 years.',
    ARRAY['Soil Sample Collection Form', 'Aadhaar Card', 'Khasra Number'],
    'https://soilhealth.dac.gov.in',
    'Department of Agriculture & Cooperation, Govt of India'
)
ON CONFLICT (title) DO NOTHING;

-- Seed Sample Mandi Prices
INSERT INTO public.market_prices (crop_name, mandi, district, state, min_price, max_price, modal_price, date)
VALUES
('Wheat (गेहूं)', 'Azadpur Mandi', 'North Delhi', 'Delhi', 2275.00, 2550.00, 2420.00, CURRENT_DATE),
('Wheat (गेहूं)', 'Khanna Mandi', 'Ludhiana', 'Punjab', 2275.00, 2450.00, 2380.00, CURRENT_DATE),
('Paddy (धान Basmati)', 'Karnal Grain Market', 'Karnal', 'Haryana', 3400.00, 3950.00, 3720.00, CURRENT_DATE),
('Mustard (सरसों)', 'Alwar Mandi', 'Alwar', 'Rajasthan', 5400.00, 5950.00, 5650.00, CURRENT_DATE),
('Cotton (कपास)', 'Rajkot Mandi', 'Rajkot', 'Gujarat', 6800.00, 7500.00, 7200.00, CURRENT_DATE),
('Tomato (टमाटर)', 'Kolar Market', 'Kolar', 'Karnataka', 1200.00, 1800.00, 1500.00, CURRENT_DATE),
('Potato (आलू)', 'Agra Mandi', 'Agra', 'Uttar Pradesh', 1100.00, 1650.00, 1400.00, CURRENT_DATE),
('Soybean (सोयाबीन)', 'Indore APMC', 'Indore', 'Madhya Pradesh', 4400.00, 4850.00, 4650.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Seed Active Coupons
INSERT INTO public.coupons (code, discount_percent, max_discount_amount, min_order_value, expires_at, is_active)
VALUES
('KISAN10', 10.00, 500.00, 1000.00, NOW() + INTERVAL '30 days', true),
('FIRSTCROP', 15.00, 1000.00, 2000.00, NOW() + INTERVAL '60 days', true),
('BULKHARVEST', 8.00, 2500.00, 10000.00, NOW() + INTERVAL '90 days', true)
ON CONFLICT (code) DO NOTHING;
