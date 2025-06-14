
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Tables } from '@/integrations/supabase/types';

type Category = Tables<'categories'>;

export const categoryFormSchema = z.object({
  name: z.string().min(2, { message: "שם קטגוריה חייב להכיל לפחות 2 תווים." }),
  slug: z.string().min(2, { message: "סלאג חייב להכיל לפחות 2 תווים." }).regex(/^[a-z0-9-]+$/, 'סלאג יכול להכיל רק אותיות קטנות באנגלית, מספרים ומקפים.'),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (values: z.infer<typeof categoryFormSchema>) => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, isSubmitting }) => {
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      color: category?.color || '',
      icon: category?.icon || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם קטגוריה</FormLabel>
              <FormControl>
                <Input placeholder="לדוגמה: קינוחים" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סלאג (באנגלית)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., desserts" {...field} />
              </FormControl>
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
              <FormControl>
                <Textarea placeholder="תיאור קצר של הקטגוריה" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>צבע רקע (Tailwind class)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., bg-rose-200" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם אייקון (Lucide Icon)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cake" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : 'שמור שינויים'}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
