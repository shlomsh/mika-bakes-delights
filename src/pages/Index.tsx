
import { useState } from "react";
import * as z from 'zod';

import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";
import AuthComponent from "@/components/Auth";
import SEOHead from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { Tables } from "@/integrations/supabase/types";
import CategoryForm, { categoryFormSchema } from "@/components/CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from "@/hooks/useCategories";
import AppHeader from "@/components/AppHeader";

type Category = Tables<'categories'>;
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const Index = () => {
  const { toast } = useToast();
  
  const { 
    categories, 
    isLoadingCategories, 
    updateCategory, 
  } = useCategories();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
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
    }
  };

  return (
    <>
      <SEOHead />
      <main 
        className="min-h-screen w-full flex flex-col" 
        style={{
          backgroundImage: "linear-gradient(rgba(250, 249, 247, 0.85), rgba(250, 249, 247, 0.85)), url('/lovable-uploads/ba509ec5-29e1-4ea7-9d37-63b4c65f5cef.png')",
          backgroundRepeat: 'repeat',
          direction: "rtl"
        }}
      >
        <AppHeader categories={categories} />

        {/* Add AuthComponent positioned separately from header */}
        <div className="absolute top-20 left-4 sm:left-6 z-10">
          <AuthComponent />
        </div>

        {/* Main 2-column desktop grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-8 py-14 max-w-7xl mx-auto w-full flex-1 transition-all">
          {/* Main Hero & Picks (2 columns on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <MikaHero />
            
            {/* On mobile, categories appear here */}
            <div className="block lg:hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-fredoka text-2xl text-choco">קטגוריות</h2>
              </div>
              {isLoadingCategories ? <p>טוען קטגוריות...</p> : 
                <CategoryCards 
                  categories={categories || []}
                  onEdit={handleEdit}
                />
              }
            </div>

            <RecipePicks />
          </div>
          {/* Categories Section on Desktop */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-fredoka text-2xl text-choco">קטגוריות</h2>
            </div>
            {isLoadingCategories ? <p>טוען קטגוריות...</p> : 
              <CategoryCards 
                categories={categories || []}
                onEdit={handleEdit}
              />
            }
          </div>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => { if (!isOpen) setEditingCategory(null); setFormOpen(isOpen); }}>
          <DialogContent style={{ direction: 'rtl' }}>
            <DialogHeader>
              <DialogTitle>עריכת קטגוריה</DialogTitle>
              <DialogDescription>
                {editingCategory ? `ערוך את פרטי הקטגוריה "${editingCategory.name}".` : ''}
              </DialogDescription>
            </DialogHeader>
            <CategoryForm 
              category={editingCategory}
              onSubmit={handleFormSubmit}
              isSubmitting={updateCategory.isPending}
            />
          </DialogContent>
        </Dialog>
        
      </main>
    </>
  );
};

export default Index;
