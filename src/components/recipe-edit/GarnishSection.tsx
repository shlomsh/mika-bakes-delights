
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

const GarnishSection = () => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "garnishes",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco flex items-center">
          <Sparkles className="ml-2 h-5 w-5 text-pastelYellow" />
          תוספת (אופציונלי)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`garnishes.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>שלב {index + 1}</FormLabel>
                <div className="flex items-start gap-2">
                  <FormControl><Textarea {...field} placeholder="תאר את התוספת..." /></FormControl>
                  <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} aria-label="מחק שלב מהתוספת">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="button" variant="outline" onClick={() => append({ description: '' })}>
          <PlusCircle className="mr-2 h-4 w-4" /> הוסף שלב לתוספת
        </Button>
      </CardContent>
    </Card>
  );
};

export default GarnishSection;
