import { type Json } from "@/integrations/supabase/types"; // Import Json type

export interface Category {
  id: string;
  slug: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  created_at?: string;
  updated_at?: string;
  categories?: Category | null; // To hold joined category data if fetched
}

// The sampleRecipes array is removed as data will now come from Supabase.
// We keep this file for type definitions, or these types can be moved to a central types file later.
