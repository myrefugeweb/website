import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ltjxhzfacfqfxkwzeinc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is not set. Please check your .env file.');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is not set. Please check your .env file.');
}

// Create a safe Supabase client that won't crash the app
let supabase: SupabaseClient;

try {
  if (supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 0) {
    // Validate that the key doesn't look like a placeholder
    if (supabaseAnonKey.includes('your_') || supabaseAnonKey.includes('placeholder')) {
      console.warn('⚠️ Supabase anon key appears to be a placeholder. Please update your .env file with your actual key.');
    }
    
    // Check if user accidentally used a secret/service_role key
    if (supabaseAnonKey.includes('sb_secret_') || supabaseAnonKey.includes('service_role')) {
      console.error('❌ ERROR: You are using a SECRET/SERVICE_ROLE key in the frontend!');
      console.error('❌ Secret keys are FORBIDDEN in browser code for security reasons.');
      console.error('❌ Please use the ANON/PUBLIC key instead.');
      console.error('❌ Find it in: Supabase Dashboard → Settings → API → Project API keys → anon public');
      throw new Error('Forbidden: Secret API key cannot be used in browser. Please use the anon/public key instead.');
    }
    
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    
    console.log('✅ Supabase client initialized successfully');
  } else {
    // Use a dummy key to prevent errors - queries will fail gracefully
    console.warn('⚠️ Supabase credentials not found. App will work but database features disabled.');
    console.warn('⚠️ Please create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    supabase = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      'dummy-key-for-initialization'
    );
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase:', error);
  // Fallback: create client with minimal config
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    'dummy-key-for-initialization'
  );
}

export { supabase };

// Database types
export interface ImageUpload {
  id: string;
  section: string;
  url: string;
  alt_text?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeaderContent {
  id: string;
  page: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface SparrowsClosetContent {
  id: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface SectionLayout {
  id: string;
  section: string;
  layout_type: string;
  updated_at: string;
  updated_by?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
