import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RecipeEditForm from '@/components/RecipeEditForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RecipeWithDetails } from '@/components/recipe-page/types';
import RecipeLoading from '@/components/recipe-page/RecipeLoading';
import RecipeNotFound from '@/components/recipe-page/RecipeNotFound';
import RecipeDisplay from '@/components/recipe-page/RecipeDisplay';
import SEOHead from '@/components/SEOHead';

const fetchRecipeById = async (recipeId: string): Promise<RecipeWithDetails | null> => {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      id,
      name,
      description,
      image_url,
      category_id,
      created_at,
      updated_at,
      recommended,
      categories (
        id,
        slug,
        name
      ),
      recipe_ingredients (
        description,
        sort_order
      ),
      recipe_instructions (
        description,
        step_number
      ),
      recipe_sauces (
        description,
        step_number
      ),
      recipe_sauce_ingredients (
        description,
        sort_order
      ),
      recipe_garnish_instructions (
        description,
        step_number
      ),
      recipe_garnish_ingredients (
        description,
        sort_order
      )
    `)
    .eq('id', recipeId)
    .order('sort_order', { foreignTable: 'recipe_ingredients', ascending: true })
    .order('step_number', { foreignTable: 'recipe_instructions', ascending: true })
    .order('step_number', { foreignTable: 'recipe_sauces', ascending: true })
    .order('sort_order', { foreignTable: 'recipe_sauce_ingredients', ascending: true })
    .order('step_number', { foreignTable: 'recipe_garnish_instructions', ascending: true })
    .order('sort_order', { foreignTable: 'recipe_garnish_ingredients', ascending: true })
    .single(); 

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
  if (!data) {
    return null;
  }
  
  const recipeData = data as unknown as RecipeWithDetails;

  return recipeData;
};

const RecipePage: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recipe, isLoading, error, refetch } = useQuery({
    queryKey: ['recipe', recipeId || null], 
    queryFn: () => {
      if (!recipeId) return Promise.resolve(null);
      return fetchRecipeById(recipeId);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "הצלחה!", description: "המתכון נמחק בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipePicks'] });
      navigate('/');
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `אירעה שגיאה במחיקת המתכון: ${err.message}` });
    }
  });

  if (isLoading) {
    return <RecipeLoading />;
  }

  if (error || !recipe) {
    return <RecipeNotFound />;
  }

  const handleSaveSuccess = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['recommendedRecipes'] });
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
    refetch();
  };

  // Prepare SEO data
  const recipeTitle = `${recipe.name} - ספר המתכונים של מיקה`;
  const recipeDescription = recipe.description || `מתכון ל${recipe.name} מהאוסף של מיקה`;
  const recipeImage = recipe.image_url || '/lovable-uploads/ba509ec5-29e1-4ea7-9d37-63b4c65f5cef.png';
  const recipeUrl = `/recipe/${recipeId}`;

  if (isEditing) {
    return (
      <>
        <SEOHead
          title={`עריכת ${recipe.name} - ספר המתכונים של מיקה`}
          description={`עריכת מתכון ${recipe.name}`}
          image={recipeImage}
          url={recipeUrl}
          type="article"
        />
        <RecipeEditForm recipe={recipe} onCancel={() => setIsEditing(false)} onSaveSuccess={handleSaveSuccess} />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={recipeTitle}
        description={recipeDescription}
        image={recipeImage}
        url={recipeUrl}
        type="article"
      />
      <RecipeDisplay
        recipe={recipe}
        isAuthenticated={isAuthenticated}
        isDeletePending={deleteMutation.isPending}
        onEdit={() => setIsEditing(true)}
        onDelete={() => recipeId && deleteMutation.mutate(recipeId)}
      />
    </>
  );
};

export default RecipePage;
