
import React from "react";
import { Link } from "react-router-dom";
import DynamicIcon from "./DynamicIcon";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Category = Tables<'categories'>;

interface CategoryCardsProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories, onEdit }) => {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="flex flex-col gap-4 w-full" dir="rtl">
      {categories.map((cat) => (
        <div key={cat.id} className="relative group">
          <Link to={`/category/${cat.slug}`} className="no-underline">
            <div
              className={`rounded-2xl shadow-lg p-4 flex items-center gap-4 ${cat.color || 'bg-gray-200'} relative transition-transform hover:scale-105 cursor-pointer`}
              dir="rtl"
            >
              {cat.icon && <DynamicIcon name={cat.icon} className="w-10 h-10 text-choco opacity-85 shrink-0" strokeWidth={2} />}
              <div className="flex-grow">
                <span className="font-fredoka text-xl text-choco tracking-wide">{cat.name}</span>
                {cat.description && <p className="mt-1 text-choco/75 text-sm leading-tight">{cat.description}</p>}
              </div>
            </div>
          </Link>
          {isAuthenticated && (
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full bg-white/50 hover:bg-white/80">
                    <MoreVertical className="h-4 w-4 text-choco" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(cat)}>
                    <Edit className="ml-2 h-4 w-4" />
                    ערוך
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default CategoryCards;
