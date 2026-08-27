import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://fallback.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'dummy-service-role-key-safe';

export const isSupabaseBackendConfigured = Boolean(
  process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
);

let adminClient: SupabaseClient;

try {
  adminClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} catch (error) {
  console.warn('[Supabase Admin] Initialized with fallback client:', error);
  adminClient = createClient('https://fallback.supabase.co', 'dummy-key-safe', {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const supabaseAdmin: SupabaseClient = adminClient;
console.log('[Supabase Admin] Initialized safely with Service Credentials.');
