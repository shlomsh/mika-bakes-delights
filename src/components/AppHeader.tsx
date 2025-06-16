
import React from 'react';
import { Link } from 'react-router-dom';
import type { Tables } from "@/integrations/supabase/types";
import { RecipeSearch } from './RecipeSearch';

type Category = Tables<'categories'>;

interface AppHeaderProps {
  categories: Category[] | undefined;
}

const AppHeader: React.FC<AppHeaderProps> = ({ categories }) => {
  return (
    <header dir="rtl" className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</Link>
      </div>
      <div className="flex items-center gap-4">
        <RecipeSearch />
      </div>
    </header>
  );
};

export default AppHeader;
