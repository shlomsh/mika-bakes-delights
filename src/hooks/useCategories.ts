
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import * as z from 'zod';
import { categoryFormSchema } from "@/components/CategoryForm";

type Category = Tables<'categories'>;
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation<void, Error, CategoryFormValues>({
    mutationFn: async (values) => {
      const { error } = await supabase.from('categories').insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `יצירת הקטגוריה נכשלה: ${err.message}` });
    },
  });

  const updateMutation = useMutation<void, Error, { values: CategoryFormValues, id: string }>({
    mutationFn: async ({ values, id }) => {
      const { error } = await supabase.from('categories').update({
        name: values.name,
        slug: values.slug,
        description: values.description,
        color: values.color,
        icon: values.icon,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `עדכון הקטגוריה נכשל: ${err.message}` });
    },
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `מחיקת הקטגוריה נכשלה: ${err.message}` });
    },
  });

  return {
    categories,
    isLoadingCategories,
    createCategory: createMutation,
    updateCategory: updateMutation,
    deleteCategory: deleteMutation,
  };
};
