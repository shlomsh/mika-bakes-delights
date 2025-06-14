import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Blend, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { recipeSchema, RecipeFormValues } from '@/schemas/recipeSchema';
import { createRecipe } from '@/api/recipes';
import IngredientsFieldArray from './form/IngredientsFieldArray';
import InstructionsFieldArray from './form/InstructionsFieldArray';
import IngredientsListFieldArray from './form/IngredientsListFieldArray';

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
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: categoryId || null,
      ingredients: [{ description: '' }],
      instructions: [{ description: '' }],
      sauces: [],
      garnish_ingredients: [],
      garnish_instructions: [],
    },
  });

  const { onChange: onImageChange, ...restImageRegister } = form.register("image_file");

  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: (recipeId) => {
      toast({ title: "הצלחה!", description: "המתכון נוצר בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipePicks'] });
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      navigate(`/recipe/${recipeId}`);
    },
    onError: (error: Error) => {
      console.error("Error creating recipe:", error);
      toast({ variant: "destructive", title: "שגיאה", description: `אירעה שגיאה ביצירת המתכון: ${error.message}` });
    }
  });

  const onSubmit = (values: RecipeFormValues) => {
    mutation.mutate(values);
  };

  return (
    <FormProvider {...form}>
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

          <IngredientsFieldArray />

          <InstructionsFieldArray 
            name="instructions"
            title="אופן ההכנה"
            addButtonLabel="הוסף שלב"
          />

          <InstructionsFieldArray 
            name="sauces"
            title="רוטב (אופציונלי)"
            titleIcon={<Blend className="ml-2 h-5 w-5 text-pastelOrange" />}
            addButtonLabel="הוסף שלב לרוטב"
          />

          <IngredientsListFieldArray 
            name="garnish_ingredients"
            title="מרכיבי התוספת (אופציונלי)"
            titleIcon={<Sparkles className="ml-2 h-5 w-5 text-pastelYellow" />}
            addButtonLabel="הוסף מרכיב לתוספת"
            placeholder="לדוגמה: פטרוזיליה קצוצה"
          />

          <InstructionsFieldArray 
            name="garnish_instructions"
            title="הוראות לתוספת (אופציונלי)"
            titleIcon={<Sparkles className="ml-2 h-5 w-5 text-pastelYellow" />}
            addButtonLabel="הוסף שלב לתוספת"
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>ביטול</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
              צור מתכון
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RecipeCreateForm;
