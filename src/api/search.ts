
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type RecipeSearchResult = Pick<Tables<'recipes'>, 'id' | 'name'>;

export async function searchRecipesByName(query: string): Promise<RecipeSearchResult[]> {
  if (!query) {
    return [];
  }

  const { data, error } = await supabase
    .from('recipes')
    .select('id, name')
    .ilike('name', `%${query}%`)
    .limit(10); // Limit results to 10

  if (error) {
    console.error("Error searching recipes:", error);
    throw new Error(error.message);
  }

  return data || [];
}
