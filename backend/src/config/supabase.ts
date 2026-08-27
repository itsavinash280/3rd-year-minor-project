import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseBackendConfigured = Boolean(
  supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder')
);

export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('[Supabase Admin] Initialized with Service Credentials for PostgreSQL Database.');
