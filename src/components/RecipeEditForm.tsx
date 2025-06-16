import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { recipeEditSchema, RecipeEditFormValues } from '@/schemas/recipeEditSchema';
import { updateRecipeInDb } from '@/api/recipeApi';
import BasicInfoSection from './recipe-edit/BasicInfoSection';
import IngredientsSection from './recipe-edit/IngredientsSection';
import InstructionsSection from './recipe-edit/InstructionsSection';
import SauceSection from './recipe-edit/SauceSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RecipeWithDetails } from '@/components/recipe-page/types';
import GarnishSection from './recipe-edit/GarnishSection';
import { useCategories } from '@/hooks/useCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecipeEditFormProps {
  recipe: RecipeWithDetails;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({ recipe, onCancel, onSaveSuccess }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(recipe.image_url);
  const [isRecommended, setIsRecommended] = React.useState(recipe.recommended || false);
  const { categories, isLoadingCategories } = useCategories();
  
  const form = useForm<RecipeEditFormValues>({
    resolver: zodResolver(recipeEditSchema),
    defaultValues: {
      name: recipe.name,
      description: recipe.description || '',
      category_id: recipe.category_id || null,
      ingredients: recipe.recipe_ingredients.map(i => ({ description: i.description })),
      instructions: recipe.recipe_instructions.map(i => ({ description: i.description })),
      sauce_ingredients: recipe.recipe_sauce_ingredients?.map(s => ({ description: s.description })) || [],
      sauces: recipe.recipe_sauces?.map(s => ({ description: s.description })) || [],
      garnish_ingredients: recipe.recipe_garnish_ingredients?.map(g => ({ description: g.description })) || [],
      garnish_instructions: recipe.recipe_garnish_instructions?.map(g => ({ description: g.description })) || [],
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
    mutation.mutate({ recipeId: recipe.id, values: { ...values, recommended: isRecommended } });
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

              <Card>
                <CardHeader>
                  <CardTitle className="font-fredoka text-xl text-choco">הגדרות נוספות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="recommended-switch"
                        checked={isRecommended}
                        onCheckedChange={setIsRecommended}
                        aria-label="האם המתכון מומלץ?"
                      />
                      <Label htmlFor="recommended-switch" className="mr-2">מתכון מומלץ</Label>
                    </div>
                    <p className="text-sm text-choco/70 mt-2">
                      מתכונים מומלצים יופיעו בעמוד הבית.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>קטגוריה</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value === 'no-category' ? null : value)}
                          defaultValue={field.value || 'no-category'}
                          disabled={isLoadingCategories}
                          dir="rtl"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר קטגוריה..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no-category">ללא קטגוריה</SelectItem>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <IngredientsSection />
              <InstructionsSection />
              <SauceSection />
              <GarnishSection />

              <div className="flex justify-end gap-2 sm:gap-4">
                {/* Desktop Cancel Button */}
                <Button type="button" variant="ghost" onClick={onCancel} className="hidden sm:inline-flex">
                  ביטול
                </Button>
                {/* Mobile Cancel Button */}
                <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="sm:hidden" aria-label="ביטול">
                  <X className="h-5 w-5" />
                </Button>

                {/* Desktop Save Button */}
                <Button type="submit" disabled={mutation.isPending} className="hidden sm:inline-flex">
                  {mutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                  שמור שינויים
                </Button>
                {/* Mobile Save Button */}
                <Button type="submit" size="icon" disabled={mutation.isPending} className="sm:hidden" aria-label="שמור שינויים">
                  {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
