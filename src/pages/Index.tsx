import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as z from 'zod';

import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Link } from "react-router-dom";
import { ChevronDown, Plus } from "lucide-react";
import AuthComponent from "@/components/Auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import CategoryForm, { categoryFormSchema } from "@/components/CategoryForm";
import { useToast } from "@/components/ui/use-toast";

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

const Index = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

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
      toast({ title: "הצלחה!", description: "הקטגוריה נוצרה בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setFormOpen(false);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `יצירת הקטגוריה נכשלה: ${err.message}` });
    },
  });

  const updateMutation = useMutation<void, Error, CategoryFormValues>({
    mutationFn: async (values) => {
      if (!editingCategory) return;
      const { error } = await supabase.from('categories').update(values).eq('id', editingCategory.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "הצלחה!", description: "הקטגוריה עודכנה בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setFormOpen(false);
      setEditingCategory(null);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `עדכון הקטגוריה נכשל: ${err.message}` });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "הצלחה!", description: "הקטגוריה נמחקה בהצלחה." });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingCategory(null);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "שגיאה", description: `מחיקת הקטגוריה נכשלה: ${err.message}` });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleFormSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  return (
    <main className="min-h-screen w-full flex flex-col" style={{background: "#faf9f7", direction: "rtl"}}>
      {/* Header / Navbar */}
      <header className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
        {/* ... keep existing code */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-pastelYellow flex items-center justify-center font-fredoka text-xl shadow-inner border">
            מ
          </div>
          <span className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</span>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-7 font-fredoka text-choco text-lg flex-row-reverse sm:flex-nowrap">
            <a className="hover:text-pastelOrange transition" href="#">בית</a>
            <a className="hover:text-pastelOrange transition" href="#">על מיקה</a>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-pastelOrange transition outline-none">
                קטגוריות
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories?.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link to={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a className="hover:text-pastelOrange transition" href="#">מועדפים</a>
          </nav>
          <div className="flex items-center gap-4">
            {/* ... keep existing code */}
            {isAuthenticated && (
              <Button asChild>
                <Link to="/new-recipe">
                  <Plus className="ml-2 h-4 w-4" />
                  הוסף מתכון
                </Link>
              </Button>
            )}
            <AuthComponent />
          </div>
        </div>
      </header>

      {/* Main 2-column desktop grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-8 py-14 max-w-7xl mx-auto w-full flex-1 transition-all">
        {/* Main Hero & Picks (2 columns on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <MikaHero />
          <RecipePicks />
        </div>
        {/* Categories Section */}
        <div className="hidden lg:block">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-fredoka text-2xl text-choco">קטגוריות</h2>
            {isAuthenticated && (
              <Button onClick={handleAddNew}>
                <Plus className="ml-2 h-4 w-4" /> הוסף קטגוריה
              </Button>
            )}
          </div>
          {isLoadingCategories ? <p>טוען קטגוריות...</p> : 
            <CategoryCards 
              categories={categories || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          }
        </div>
      </div>
      {/* On mobile, categories below */}
      <div className="block lg:hidden px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-fredoka text-2xl text-choco">קטגוריות</h2>
          {isAuthenticated && (
            <Button onClick={handleAddNew}>
              <Plus className="ml-2 h-4 w-4" /> הוסף קטגוריה
            </Button>
          )}
        </div>
        {isLoadingCategories ? <p>טוען קטגוריות...</p> : 
          <CategoryCards 
            categories={categories || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        }
      </div>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditingCategory(null); setFormOpen(isOpen); }}>
        <DialogContent style={{ direction: 'rtl' }}>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? `ערוך את פרטי הקטגוריה "${editingCategory.name}".` : 'מלא את הפרטים כדי להוסיף קטגוריה חדשה.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm 
            category={editingCategory}
            onSubmit={handleFormSubmit}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deletingCategory} onOpenChange={(isOpen) => !isOpen && setDeletingCategory(null)}>
        <AlertDialogContent style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את הקטגוריה "{deletingCategory?.name}". לא ניתן לשחזר פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingCategory(null)}>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? "מוחק..." : "מחק"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Index;
