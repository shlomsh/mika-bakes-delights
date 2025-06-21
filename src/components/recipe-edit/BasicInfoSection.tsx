
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Image } from 'lucide-react';
import { RecipeEditFormValues } from '@/schemas/recipeEditSchema';

interface BasicInfoSectionProps {
  imagePreview: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  recipeName: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ imagePreview, handleImageChange, recipeName }) => {
  const { control } = useFormContext<RecipeEditFormValues>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(event);
  };

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
        <FormField
          control={control}
          name="image_file"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>תמונת מתכון</FormLabel>
              {imagePreview && (
                <div className="mt-2 mb-4">
                  <img 
                    src={imagePreview} 
                    alt="תצוגה מקדימה" 
                    className="w-full max-w-sm rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow duration-200" 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  className="w-full sm:w-auto bg-pastelYellow/20 border-pastelYellow hover:bg-pastelYellow/40 text-choco font-fredoka transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Upload className="ml-2 h-4 w-4" />
                  {imagePreview ? 'שנה תמונה' : 'העלה תמונה'}
                </Button>
                <p className="text-sm text-choco/60 flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  קבצי תמונה בלבד (JPG, PNG, WebP)
                </p>
              </div>
              <FormControl>
                <input
                  {...field}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    onChange(event.target.files);
                    handleFileChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
