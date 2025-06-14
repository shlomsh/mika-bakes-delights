
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(3, { message: "שם המתכון חייב להכיל לפחות 3 תווים." }),
  description: z.string().optional(),
  image_file: z.instanceof(FileList).optional(),
  ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות מרכיב אחד."),
  instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור ההוראה לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות שלב הכנה אחד.")
});

type RecipeFormValues = z.infer<typeof formSchema>;

async function createRecipeInDb({ values }: { values: RecipeFormValues }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in to save changes.");
  }
  
  const { name, description, ingredients, instructions, image_file } = values;

  // 1. Create recipe and get its ID
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({ name, description: description || null })
    .select('id')
    .single();

  if (recipeError) throw recipeError;
  const recipeId = recipeData.id;

  // 2. Upload image if provided
  let newImageUrl: string | undefined = undefined;

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

    newImageUrl = urlData.publicUrl;

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
  
  // Return recipeId for redirection
  return recipeId;
}

const RecipeCreateForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      ingredients: [{ description: '' }],
      instructions: [{ description: '' }],
    },
  });

  const { onChange: onImageChange, ...restImageRegister } = form.register("image_file");

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control, name: "ingredients"
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control, name: "instructions"
  });

  const mutation = useMutation({
    mutationFn: createRecipeInDb,
    onSuccess: (recipeId) => {
      toast({ title: "הצלחה!", description: "המתכון נוצר בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipePicks'] });
      navigate(`/recipe/${recipeId}`);
    },
    onError: (error: Error) => {
      console.error("Error creating recipe:", error);
      toast({ variant: "destructive", title: "שגיאה", description: `אירעה שגיאה ביצירת המתכון: ${error.message}` });
    }
  });

  const onSubmit = (values: RecipeFormValues) => {
    mutation.mutate({ values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-fredoka text-3xl text-choco">יצירת מתכון חדש</CardTitle>
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
                          setImagePreview(null);
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

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate('/')}>ביטול</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
            צור מתכון
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeCreateForm;
