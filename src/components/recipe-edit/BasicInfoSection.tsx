
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

interface BasicInfoSectionProps {
  imagePreview: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  recipeName: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ imagePreview, handleImageChange, recipeName }) => {
  const { control, register } = useFormContext<RecipeEditFormValues>();
  const { onChange: onImageFieldChange, ...restImageRegister } = register("image_file");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-fredoka text-3xl text-choco">עריכת מתכון: {recipeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
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
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תיאור</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                onImageFieldChange(event);
                handleImageChange(event);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
