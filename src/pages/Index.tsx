
import { useState } from "react";
import * as z from 'zod';

import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";
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

import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";
import CategoryForm, { categoryFormSchema } from "@/components/CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/hooks/useCategories";
import AppHeader from "@/components/AppHeader";

type Category = Tables<'categories'>;
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const { 
    categories, 
    isLoadingCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleFormSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory.mutate({ values, id: editingCategory.id }, {
        onSuccess: () => {
          toast({ title: "הצלחה!", description: "הקטגוריה עודכנה בהצלחה." });
          setFormOpen(false);
          setEditingCategory(null);
        }
      });
    } else {
      createCategory.mutate(values, {
        onSuccess: () => {
          toast({ title: "הצלחה!", description: "הקטגוריה נוצרה בהצלחה." });
          setFormOpen(false);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteCategory.mutate(deletingCategory.id, {
        onSuccess: () => {
          toast({ title: "הצלחה!", description: "הקטגוריה נמחקה בהצלחה." });
          setDeletingCategory(null);
        }
      });
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormOpen(true);
  };

  return (
    <main className="min-h-screen w-full flex flex-col" style={{background: "#faf9f7", direction: "rtl"}}>
      <AppHeader categories={categories} isAuthenticated={isAuthenticated} />

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
            isSubmitting={createCategory.isPending || updateCategory.isPending}
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
              onClick={handleDeleteConfirm}
              disabled={deleteCategory.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteCategory.isPending ? "מוחק..." : "מחק"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default Index;
