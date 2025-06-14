
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { RecipeFormValues } from '@/schemas/recipeSchema';

interface InstructionsFieldArrayProps {
  name: "instructions" | "sauces" | "garnishes";
  title: string;
  titleIcon?: React.ReactNode;
  addButtonLabel: string;
}

const InstructionsFieldArray: React.FC<InstructionsFieldArrayProps> = ({ name, title, titleIcon, addButtonLabel }) => {
  const { control } = useFormContext<RecipeFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-xl text-choco flex items-center">
            {titleIcon}{title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`${name}.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>שלב {index + 1}</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl><Textarea {...field} /></FormControl>
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="button" variant="outline" onClick={() => append({ description: '' })}>
          <PlusCircle className="ml-2 h-4 w-4" /> {addButtonLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstructionsFieldArray;
