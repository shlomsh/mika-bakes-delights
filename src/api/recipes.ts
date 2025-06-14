import { supabase } from '@/integrations/supabase/client';
import { RecipeFormValues } from '@/schemas/recipeSchema';

export async function createRecipe(values: RecipeFormValues) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in to save changes.");
  }
  
  const { name, description, ingredients, instructions, sauces, image_file, category_id, garnish_ingredients, garnish_instructions } = values;

  // 1. Create recipe and get its ID
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({ name, description: description || null, category_id: category_id || null })
    .select('id')
    .single();

  if (recipeError) throw recipeError;
  const recipeId = recipeData.id;

  // 2. Upload image if provided
  if (image_file && image_file.length > 0) {
    const file = image_file[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${recipeId}.${fileExt}`;

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

    const newImageUrl = urlData.publicUrl;

    // Update recipe with image URL
    const { error: updateImageError } = await supabase
      .from('recipes')
      .update({ image_url: newImageUrl })
      .eq('id', recipeId);
    
    if (updateImageError) throw updateImageError;
  }

  // 3. Insert ingredients
  if (ingredients.length > 0) {
    const newIngredients = ingredients.map((ing, index) => ({
      recipe_id: recipeId,
      description: ing.description,
      sort_order: index + 1
    }));
    const { error: insertIngredientsError } = await supabase.from('recipe_ingredients').insert(newIngredients);
    if (insertIngredientsError) throw insertIngredientsError;
  }

  // 4. Insert instructions
  if (instructions.length > 0) {
    const newInstructions = instructions.map((inst, index) => ({
      recipe_id: recipeId,
      description: inst.description,
      step_number: index + 1
    }));
    const { error: insertInstructionsError } = await supabase.from('recipe_instructions').insert(newInstructions);
    if (insertInstructionsError) throw insertInstructionsError;
  }

  // 5. Insert sauces
  if (sauces && sauces.length > 0) {
    const newSauces = sauces.map((s, index) => ({
      recipe_id: recipeId,
      description: s.description,
      step_number: index + 1
    }));
    const { error: insertSaucesError } = await supabase.from('recipe_sauces').insert(newSauces);
    if (insertSaucesError) throw insertSaucesError;
  }

  // 6. Insert garnish ingredients
  if (garnish_ingredients && garnish_ingredients.length > 0) {
    const newGarnishIngredients = garnish_ingredients.map((g, index) => ({
      recipe_id: recipeId,
      description: g.description,
      sort_order: index + 1
    }));
    const { error: insertGarnishIngredientsError } = await supabase.from('recipe_garnish_ingredients').insert(newGarnishIngredients);
    if (insertGarnishIngredientsError) throw insertGarnishIngredientsError;
  }
  
  // 7. Insert garnish instructions
  if (garnish_instructions && garnish_instructions.length > 0) {
    const newGarnishInstructions = garnish_instructions.map((g, index) => ({
      recipe_id: recipeId,
      description: g.description,
      step_number: index + 1
    }));
    const { error: insertGarnishInstructionsError } = await supabase.from('recipe_garnish_instructions').insert(newGarnishInstructions);
    if (insertGarnishInstructionsError) throw insertGarnishInstructionsError;
  }
  
  // Return recipeId for redirection
  return recipeId;
}
