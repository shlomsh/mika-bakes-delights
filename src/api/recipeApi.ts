
import { supabase } from '@/integrations/supabase/client';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

export async function updateRecipeInDb({ recipeId, values }: { recipeId: string, values: RecipeEditFormValues & { recommended?: boolean } }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in to save changes.");
  }
  
  const { name, description, ingredients, instructions, sauces, image_file, sauce_ingredients, recommended, garnish_ingredients, garnish_instructions, category_id } = values;

  let newImageUrl: string | undefined = undefined;

  if (image_file && image_file.length > 0) {
    const file = image_file[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${recipeId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Storage error: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(filePath);

    newImageUrl = urlData.publicUrl;
  }

  const recipeUpdateData: { name: string; description?: string | null; image_url?: string; recommended?: boolean; category_id?: string | null } = {
    name,
    description: values.description || null,
  };

  if (newImageUrl) {
    recipeUpdateData.image_url = newImageUrl;
  }
  
  if (typeof recommended === 'boolean') {
    recipeUpdateData.recommended = recommended;
  }

  if (category_id !== undefined) {
    recipeUpdateData.category_id = category_id;
  }

  const { error: recipeError } = await supabase
    .from('recipes')
    .update(recipeUpdateData)
    .eq('id', recipeId);

  if (recipeError) throw recipeError;

  // Clear and update related tables
  const tablesToUpdate = [
    { name: 'recipe_ingredients', data: ingredients, sortKey: 'sort_order' },
    { name: 'recipe_instructions', data: instructions, sortKey: 'step_number' },
    { name: 'recipe_sauce_ingredients', data: sauce_ingredients, sortKey: 'sort_order' },
    { name: 'recipe_sauces', data: sauces, sortKey: 'step_number' },
    { name: 'recipe_garnish_ingredients', data: garnish_ingredients, sortKey: 'sort_order' },
    { name: 'recipe_garnish_instructions', data: garnish_instructions, sortKey: 'step_number' },
  ] as const;

  for (const table of tablesToUpdate) {
    const { error: deleteError } = await supabase.from(table.name).delete().eq('recipe_id', recipeId);
    if (deleteError) throw deleteError;

    if (table.data && table.data.length > 0) {
      const newData = table.data.map((item, index) => ({
        recipe_id: recipeId,
        description: item.description,
        [table.sortKey]: index + 1,
      }));
      // Using `as any` to work around a complex TypeScript + Supabase typing issue with dynamic table names.
      // The structure is guaranteed by the `tablesToUpdate` array definition.
      const { error: insertError } = await supabase.from(table.name).insert(newData as any);
      if (insertError) throw insertError;
    }
  }
}
