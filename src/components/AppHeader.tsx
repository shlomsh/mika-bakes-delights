
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthComponent from "@/components/Auth";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Category = Tables<'categories'>;

interface AppHeaderProps {
  categories: Category[] | undefined;
  isAuthenticated: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ categories, isAuthenticated }) => {
  return (
    <header className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 flex-row-reverse">
        <div className="w-10 h-10 rounded-full bg-pastelYellow flex items-center justify-center font-fredoka text-xl shadow-inner border">
          מ
        </div>
        <span className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</span>
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-7 font-fredoka text-choco text-lg flex-row-reverse sm:flex-nowrap">
          <Link className="hover:text-pastelOrange transition" to="/">בית</Link>
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
  );
};

export default AppHeader;
