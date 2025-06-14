import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, Save, Blend, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Recipe as BaseRecipe } from '@/data/sampleRecipes';

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

const formSchema = z.object({
  name: z.string().min(3, { message: "שם המתכון חייב להכיל לפחות 3 תווים." }),
  description: z.string().optional(),
  image_file: z.instanceof(FileList).optional(),
  ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לא יכול להיות ריק." })
  })),
  instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור ההוראה לא יכול להיות ריק." })
  })),
  sauces: z.array(z.object({
    description: z.string().min(1, { message: "תיאור הרוטב לא יכול להיות ריק." })
  })).optional(),
  garnishes: z.array(z.object({
    description: z.string().min(1, { message: "תיאור התוספת לא יכול להיות ריק." })
  })).optional(),
});

type RecipeFormValues = z.infer<typeof formSchema>;

interface RecipeEditFormProps {
  recipe: RecipeWithDetails;
  onCancel: () => void;
  onSaveSuccess: () => void;
}

async function updateRecipeInDb({ recipeId, values }: { recipeId: string, values: RecipeFormValues }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in to save changes.");
  }
  
  const { name, description, ingredients, instructions, sauces, garnishes, image_file } = values;

  let newImageUrl: string | undefined = undefined;

  if (image_file && image_file.length > 0) {
    const file = image_file[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${recipeId}-${Date.now()}.${fileExt}`;

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

  const recipeUpdateData: { name: string; description?: string | null; image_url?: string } = {
    name,
    description: values.description || null,
  };

  if (newImageUrl) {
    recipeUpdateData.image_url = newImageUrl;
  }

  const { error: recipeError } = await supabase
    .from('recipes')
    .update(recipeUpdateData)
    .eq('id', recipeId);

  if (recipeError) throw recipeError;

  const { error: deleteIngredientsError } = await supabase.from('recipe_ingredients').delete().eq('recipe_id', recipeId);
  if (deleteIngredientsError) throw deleteIngredientsError;

  if (ingredients.length > 0) {
    const newIngredients = ingredients.map((ing, index) => ({
      recipe_id: recipeId,
      description: ing.description,
      sort_order: index + 1
    }));
    const { error: insertIngredientsError } = await supabase.from('recipe_ingredients').insert(newIngredients);
    if (insertIngredientsError) throw insertIngredientsError;
  }

  const { error: deleteInstructionsError } = await supabase.from('recipe_instructions').delete().eq('recipe_id', recipeId);
  if (deleteInstructionsError) throw deleteInstructionsError;

  if (instructions.length > 0) {
    const newInstructions = instructions.map((inst, index) => ({
      recipe_id: recipeId,
      description: inst.description,
      step_number: index + 1
    }));
    const { error: insertInstructionsError } = await supabase.from('recipe_instructions').insert(newInstructions);
    if (insertInstructionsError) throw insertInstructionsError;
  }

  // Update sauces
  const { error: deleteSaucesError } = await supabase.from('recipe_sauces').delete().eq('recipe_id', recipeId);
  if (deleteSaucesError) throw deleteSaucesError;

  if (sauces && sauces.length > 0) {
    const newSauces = sauces.map((s, index) => ({
      recipe_id: recipeId,
      description: s.description,
      step_number: index + 1
    }));
    const { error: insertSaucesError } = await supabase.from('recipe_sauces').insert(newSauces);
    if (insertSaucesError) throw insertSaucesError;
  }

  // Update garnishes
  const { error: deleteGarnishesError } = await supabase.from('recipe_garnishes').delete().eq('recipe_id', recipeId);
  if (deleteGarnishesError) throw deleteGarnishesError;

  if (garnishes && garnishes.length > 0) {
    const newGarnishes = garnishes.map((g, index) => ({
      recipe_id: recipeId,
      description: g.description,
      step_number: index + 1
    }));
    const { error: insertGarnishesError } = await supabase.from('recipe_garnishes').insert(newGarnishes);
    if (insertGarnishesError) throw insertGarnishesError;
  }

  // Log the update
  const { error: logError } = await supabase.from('recipe_update_logs').insert({
      recipe_id: recipeId,
      user_id: user.id,
      changes: values as any,
  });

  if (logError) {
      // Log failure should not fail the entire operation, just log it to console.
      console.error("Failed to log recipe update:", logError);
  }
}

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({ recipe, onCancel, onSaveSuccess }) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = React.useState<string | null>(recipe.image_url);
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: recipe.name,
      description: recipe.description || '',
      ingredients: recipe.recipe_ingredients.map(i => ({ description: i.description })),
      instructions: recipe.recipe_instructions.map(i => ({ description: i.description })),
      sauces: recipe.recipe_sauces?.map(s => ({ description: s.description })) || [],
      garnishes: recipe.recipe_garnishes?.map(g => ({ description: g.description })) || [],
    },
  });

  const { onChange: onImageChange, ...restImageRegister } = form.register("image_file");

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control, name: "ingredients"
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control, name: "instructions"
  });

  const { fields: sauceFields, append: appendSauce, remove: removeSauce } = useFieldArray({
    control: form.control, name: "sauces"
  });

  const { fields: garnishFields, append: appendGarnish, remove: removeGarnish } = useFieldArray({
    control: form.control, name: "garnishes"
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

  const onSubmit = (values: RecipeFormValues) => {
    mutation.mutate({ recipeId: recipe.id, values });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ background: "#faf9f7", direction: "rtl" }}>
      <main className="w-full max-w-5xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-3xl text-choco">עריכת מתכון: {recipe.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם המתכון</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תיאור</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_file"
                  render={() => (
                    <FormItem>
                      <FormLabel>תמונת מתכון</FormLabel>
                      {imagePreview && (
                        <div className="mt-2">
                          <img src={imagePreview} alt="תצוגה מקדימה" className="w-full max-w-sm rounded-md object-cover" />
                        </div>
                      )}
                      <FormControl>
                        <Input 
                          type="file" 
                          accept="image/*"
                          {...restImageRegister}
                          onChange={(event) => {
                            onImageChange(event);
                            const file = event.target.files?.[0];
                            if (file) {
                              setImagePreview(URL.createObjectURL(file));
                            } else {
                              setImagePreview(recipe.image_url);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-xl text-choco">מצרכים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ingredientFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`ingredients.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl><Input {...field} placeholder={`מרכיב ${index + 1}`} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" onClick={() => appendIngredient({ description: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" /> הוסף מרכיב
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-xl text-choco">אופן ההכנה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructionFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`instructions.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                         <FormLabel>שלב {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl><Textarea {...field} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" onClick={() => appendInstruction({ description: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" /> הוסף שלב
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-xl text-choco flex items-center">
                  <Blend className="ml-2 h-5 w-5 text-pastelOrange" />
                  רוטב (אופציונלי)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sauceFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`sauces.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שלב {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl><Textarea {...field} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeSauce(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" onClick={() => appendSauce({ description: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" /> הוסף שלב לרוטב
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-fredoka text-xl text-choco flex items-center">
                  <Sparkles className="ml-2 h-5 w-5 text-pastelYellow" />
                  תוספת (אופציונלי)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {garnishFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`garnishes.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שלב {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl><Textarea {...field} /></FormControl>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeGarnish(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="button" variant="outline" onClick={() => appendGarnish({ description: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" /> הוסף שלב לתוספת
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                שמור שינויים
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default RecipeEditForm;
