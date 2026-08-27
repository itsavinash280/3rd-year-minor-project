import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration with safe fallback
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://o2crfq9istwthesm194iga.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o2CRFq9isTWtHEsM194iGA_TwIV5PES';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('placeholder')
);

let client: SupabaseClient;

try {
  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
} catch (err) {
  console.warn('[Supabase] Initialized with fallback dummy client:', err);
  client = createClient('https://fallback.supabase.co', 'dummy-anon-key-safe', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const supabase = client;

// Helper services for database tables with safe error handling
export const supabaseDb = {
  // Marketplace & Listings
  async getCropListings(category?: string, district?: string) {
    try {
      let query = supabase
        .from('crop_listings')
        .select('*')
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: false });

      if (category && category !== 'ALL') query = query.eq('crop_category', category);
      if (district) query = query.eq('district', district);

      return await query;
    } catch (e) {
      console.warn('[Supabase] getCropListings error:', e);
      return { data: [], error: e };
    }
  },

  async createCropListing(listingData: any) {
    try {
      return await supabase.from('crop_listings').insert([listingData]).select();
    } catch (e) {
      return { data: null, error: e };
    }
  },

  // Live Mandi Prices
  async getMarketPrices(cropName?: string, district?: string) {
    try {
      let query = supabase.from('market_prices').select('*').order('date', { ascending: false });
      if (cropName) query = query.ilike('crop_name', `%${cropName}%`);
      if (district) query = query.eq('district', district);
      return await query;
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // Government Schemes
  async getGovernmentSchemes(category?: string) {
    try {
      let query = supabase.from('government_schemes').select('*').order('created_at', { ascending: false });
      if (category && category !== 'ALL') query = query.eq('category', category);
      return await query;
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // AI Price Predictions
  async getPricePredictions(cropName?: string) {
    try {
      let query = supabase.from('price_predictions').select('*');
      if (cropName) query = query.ilike('crop_name', `%${cropName}%`);
      return await query;
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // Orders
  async getUserOrders(userId: string) {
    try {
      return await supabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('created_at', { ascending: false });
    } catch (e) {
      return { data: [], error: e };
    }
  },

  async createOrder(orderData: any, items: any[]) {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      if (items && items.length > 0) {
        const formattedItems = items.map((item) => ({
          ...item,
          order_id: order.id,
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(formattedItems);
        if (itemsError) throw itemsError;
      }

      return order;
    } catch (e) {
      console.warn('[Supabase] createOrder error:', e);
      return null;
    }
  },

  // AI Scans and Disease Detection
  async saveDiseaseScan(scanData: any) {
    try {
      return await supabase.from('disease_detections').insert([scanData]).select().single();
    } catch (e) {
      return { data: null, error: e };
    }
  },

  async getFarmerDiseaseScans(farmerId: string) {
    try {
      return await supabase
        .from('disease_detections')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // AI Crop Recommendations
  async saveCropRecommendation(recommendationData: any) {
    try {
      return await supabase.from('crop_recommendations').insert([recommendationData]).select().single();
    } catch (e) {
      return { data: null, error: e };
    }
  },

  async getFarmerCropRecommendations(farmerId: string) {
    try {
      return await supabase
        .from('crop_recommendations')
        .select('*')
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // Expert Consultations
  async getExpertConsultations(userId: string) {
    try {
      return await supabase
        .from('expert_consultations')
        .select('*')
        .or(`farmer_id.eq.${userId},expert_id.eq.${userId}`)
        .order('created_at', { ascending: false });
    } catch (e) {
      return { data: [], error: e };
    }
  },

  async createConsultation(consultationData: any) {
    try {
      return await supabase.from('expert_consultations').insert([consultationData]).select().single();
    } catch (e) {
      return { data: null, error: e };
    }
  },

  // Active Coupons
  async getCoupons() {
    try {
      return await supabase.from('coupons').select('*').eq('is_active', true);
    } catch (e) {
      return { data: [], error: e };
    }
  },

  // User Notifications
  async getNotifications(userId: string) {
    try {
      return await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    } catch (e) {
      return { data: [], error: e };
    }
  },
};
