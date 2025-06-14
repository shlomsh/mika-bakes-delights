import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, ChefHat, ListChecks, Utensils, Pencil, Trash2, Blend, Sparkles } from 'lucide-react';
import { Recipe as BaseRecipe } from '@/data/sampleRecipes';
import RecipeEditForm from '@/components/RecipeEditForm';
import { useAuth } from '@/hooks/useAuth';
import AuthComponent from '@/components/Auth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Ingredient {
  description: string;
  sort_order: number;
}

interface Instruction {
  description: string;
  step_number: number;
}

interface Sauce {
  description: string;
  step_number: number;
}

interface Garnish {
  description: string;
  step_number: number;
}

type RecipeWithDetails = Omit<BaseRecipe, 'ingredients' | 'instructions'> & {
  recipe_ingredients: Ingredient[];
  recipe_instructions: Instruction[];
  recipe_sauces: Sauce[];
  recipe_garnishes: Garnish[];
  categories: {
    id: string;
    slug: string;
    name: string;
  } | null;
};


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
      recipe_garnishes (
        description,
        step_number
      )
    `)
    .eq('id', recipeId)
    .order('sort_order', { foreignTable: 'recipe_ingredients', ascending: true })
    .order('step_number', { foreignTable: 'recipe_instructions', ascending: true })
    .order('step_number', { foreignTable: 'recipe_sauces', ascending: true })
    .order('step_number', { foreignTable: 'recipe_garnishes', ascending: true })
    .single(); 

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
  return data as unknown as RecipeWithDetails;
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
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <ChefHat className="h-16 w-16 text-choco animate-pulse mb-4" />
        <p className="text-choco text-xl font-fredoka">טוען מתכון...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
        <header className="w-full max-w-4xl mb-10 flex justify-between items-center">
          <h1 className="font-fredoka text-3xl text-choco">
            אופס! מתכון לא נמצא
          </h1>
          <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
        </header>
        <main className="w-full max-w-4xl">
          <p className="text-choco/80 text-lg text-center">
            לא הצלחנו למצוא את המתכון המבוקש. אולי הוא התחבא? נסה לחזור אחורה ולבחור מתכון אחר.
          </p>
        </main>
      </div>
    );
  }

  const handleSaveSuccess = () => {
    setIsEditing(false);
    refetch();
  };

  if (isEditing) {
    return <RecipeEditForm recipe={recipe} onCancel={() => setIsEditing(false)} onSaveSuccess={handleSaveSuccess} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <header className="w-full max-w-5xl mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="font-fredoka text-3xl md:text-4xl text-choco text-center md:text-right">{recipe.name}</h1>
          {recipe.categories && (
            <Link to={`/category/${recipe.categories.slug}`} className="text-pastelOrange hover:underline font-fredoka text-lg">
              קטגוריה: {recipe.categories.name}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <Button variant="outline" className="text-choco border-choco hover:bg-choco/10" onClick={() => setIsEditing(true)}>
                <Pencil className="ml-2 h-4 w-4" />
                ערוך מתכון
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="ml-2 h-4 w-4" />
                    מחק מתכון
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent style={{direction: 'rtl'}}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
                    <AlertDialogDescription>
                      פעולה זו לא ניתנת לביטול. פעולה זו תמחק לצמיתות את המתכון מהשרתים שלנו.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ביטול</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => recipeId && deleteMutation.mutate(recipeId)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "מוחק..." : "מחק"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button asChild variant="outline" className="text-choco border-choco hover:bg-choco/10">
            <Link to="/">
              <ArrowRight className="ml-2 h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </Button>
          <AuthComponent />
        </div>
      </header>

      <main className="w-full max-w-5xl">
        <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={recipe.image_url || `https://via.placeholder.com/600x400/f0e0d0/a08070?text=${encodeURIComponent(recipe.name)}`}
                alt={recipe.name}
                className="w-full h-64 md:h-full object-cover md:rounded-r-lg md:rounded-l-none"
              />
            </div>
            <div className="md:w-1/2 flex flex-col">
              <CardHeader className="pb-3">
                {recipe.description && (
                  <CardDescription className="text-choco/80 text-md leading-relaxed">
                    {recipe.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                      <ListChecks className="mr-2 text-pastelOrange" />
                      מצרכים:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                      {recipe.recipe_ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.recipe_sauces && recipe.recipe_sauces.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                      <Blend className="mr-2 text-pastelOrange" />
                      רוטב:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                      {recipe.recipe_sauces.map((step) => (
                        <li key={step.step_number}>{step.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.recipe_garnishes && recipe.recipe_garnishes.length > 0 && (
                  <div className="mb-6">
                    <h2 className="font-fredoka text-xl text-choco mb-2 flex items-center">
                      <Sparkles className="mr-2 text-pastelYellow" />
                      תוספת:
                    </h2>
                    <ul className="list-disc list-inside space-y-1 text-choco/90 bg-pastelYellow/20 p-4 rounded-md">
                      {recipe.recipe_garnishes.map((step) => (
                        <li key={step.step_number}>{step.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
          {recipe.recipe_instructions && recipe.recipe_instructions.length > 0 && (
            <CardFooter className="flex-col items-start p-6 bg-white rounded-b-lg border-t border-choco/10">
              <h2 className="font-fredoka text-xl text-choco mb-4 flex items-center">
                <Utensils className="mr-2 text-pastelBlue" />
                אופן ההכנה:
              </h2>
              <ol className="w-full list-none space-y-6 text-choco/90">
                {recipe.recipe_instructions.map((step) => (
                  <li key={step.step_number} className="flex items-start gap-x-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pastelBlue text-choco font-fredoka text-lg font-bold">
                      {step.step_number}
                    </div>
                    <div
                      className="flex-1 pt-1 leading-relaxed text-choco/90"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </li>
                ))}
              </ol>
            </CardFooter>
          )}
        </Card>
      </main>
    </div>
  );
};

export default RecipePage;
