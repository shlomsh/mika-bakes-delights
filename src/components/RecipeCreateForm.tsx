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
import { PlusCircle, Trash2, Loader2, Save, Blend, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(3, { message: "שם המתכון חייב להכיל לפחות 3 תווים." }),
  description: z.string().optional(),
  category_id: z.string().uuid().nullable().optional(),
  image_file: z.instanceof(FileList).optional(),
  ingredients: z.array(z.object({
    description: z.string().min(1, { message: "תיאור המרכיב לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות מרכיב אחד."),
  instructions: z.array(z.object({
    description: z.string().min(1, { message: "תיאור ההוראה לא יכול להיות ריק." })
  })).min(1, "יש להוסיף לפחות שלב הכנה אחד."),
  sauces: z.array(z.object({
    description: z.string().min(1, { message: "תיאור הרוטב לא יכול להיות ריק." })
  })).optional(),
  garnishes: z.array(z.object({
    description: z.string().min(1, { message: "תיאור התוספת לא יכול להיות ריק." })
  })).optional(),
});

type RecipeFormValues = z.infer<typeof formSchema>;

async function createRecipeInDb({ values }: { values: RecipeFormValues }) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Please log in to save changes.");
  }
  
  const { name, description, ingredients, instructions, sauces, garnishes, image_file, category_id } = values;

  // 1. Create recipe and get its ID
  const { data: recipeData, error: recipeError } = await supabase
    .from('recipes')
    .insert({ name, description: description || null, category_id: category_id || null })
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

  // 6. Insert garnishes
  if (garnishes && garnishes.length > 0) {
    const newGarnishes = garnishes.map((g, index) => ({
      recipe_id: recipeId,
      description: g.description,
      step_number: index + 1
    }));
    const { error: insertGarnishesError } = await supabase.from('recipe_garnishes').insert(newGarnishes);
    if (insertGarnishesError) throw insertGarnishesError;
  }
  
  // Return recipeId for redirection
  return recipeId;
}

interface RecipeCreateFormProps {
  categoryId?: string | null;
}

const RecipeCreateForm: React.FC<RecipeCreateFormProps> = ({ categoryId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { categories, isLoadingCategories } = useCategories();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: categoryId || null,
      ingredients: [{ description: '' }],
      instructions: [{ description: '' }],
      sauces: [],
      garnishes: [],
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>קטגוריה</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined} disabled={isLoadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה (אופציונלי)..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
