
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthComponent from "@/components/Auth";
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
        <nav className="hidden sm:flex items-center gap-6 font-fredoka text-choco text-lg">
          <Link className="hover:text-pastelOrange transition" to="/">בית</Link>
          <a className="hover:text-pastelOrange transition" href="#">על מיקה</a>
          <DropdownMenu>
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
        <div className="w-px h-6 bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-4">
          <RecipeSearch />
          <AuthComponent />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
