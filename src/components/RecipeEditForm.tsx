import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Recipe as BaseRecipe } from '@/data/sampleRecipes';
import { recipeEditSchema, RecipeEditFormValues } from '@/schemas/recipeEditSchema';
import { updateRecipeInDb } from '@/api/recipeApi';
import BasicInfoSection from './recipe-edit/BasicInfoSection';
import IngredientsSection from './recipe-edit/IngredientsSection';
import InstructionsSection from './recipe-edit/InstructionsSection';
import SauceSection from './recipe-edit/SauceSection';
import GarnishSection from './recipe-edit/GarnishSection';

// Type definitions copied from RecipePage for consistency
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

interface SauceIngredient {
  description: string;
  sort_order: number;
}

interface Garnish {
  description: string;
  step_number: number;
}

type RecipeWithDetails = Omit<BaseRecipe, 'ingredients' | 'instructions'> & {
  recipe_ingredients: Ingredient[];
  recipe_instructions: Instruction[];
  recipe_sauces: Sauce[];
  recipe_sauce_ingredients: SauceIngredient[];
  recipe_garnishes: Garnish[];
  categories: {
    id: string;
    slug: string;
    name: string;
  } | null;
};

interface RecipeEditFormProps {
  recipe: RecipeWithDetails;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({ recipe, onCancel, onSaveSuccess }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(recipe.image_url);
  
  const form = useForm<RecipeEditFormValues>({
    resolver: zodResolver(recipeEditSchema),
    defaultValues: {
      name: recipe.name,
      description: recipe.description || '',
      ingredients: recipe.recipe_ingredients.map(i => ({ description: i.description })),
      instructions: recipe.recipe_instructions.map(i => ({ description: i.description })),
      sauce_ingredients: recipe.recipe_sauce_ingredients?.map(s => ({ description: s.description })) || [],
      sauces: recipe.recipe_sauces?.map(s => ({ description: s.description })) || [],
      garnishes: recipe.recipe_garnishes?.map(g => ({ description: g.description })) || [],
    },
  });

  const mutation = useMutation({
    mutationFn: updateRecipeInDb,
    onSuccess: () => {
      toast({ title: "הצלחה!", description: "המתכון עודכן בהצלחה." });
      onSaveSuccess();
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      toast({ variant: "destructive", title: "שגיאה", description: "אירעה שגיאה בעדכון המתכון. אנא נסה שוב." });
    }
  });

  const onSubmit = (values: RecipeEditFormValues) => {
    mutation.mutate({ recipeId: recipe.id, values });
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(recipe.image_url); // Fallback to original image if selection is cancelled
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <main className="w-full max-w-5xl">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <BasicInfoSection 
                recipeName={recipe.name}
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
              />

              <IngredientsSection />
              <InstructionsSection />
              <SauceSection />
              <GarnishSection />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                  שמור שינויים
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </main>
    </div>
  );
};

export default RecipeEditForm;
