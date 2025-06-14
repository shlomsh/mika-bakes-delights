
import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { categories } from "@/data/categoriesData";
import { ChevronDown } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen w-full flex flex-col" style={{background: "#faf9f7", direction: "rtl"}}>
      {/* Header / Navbar */}
      <header className="w-full flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0 py-4 px-6 bg-white border-b border-gray-100 shadow-sm sm:flex-row-reverse">
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-pastelYellow flex items-center justify-center font-fredoka text-xl shadow-inner border">
            מ
          </div>
          <span className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:gap-7 font-fredoka text-choco text-lg flex-row-reverse sm:flex-nowrap">
          <a className="hover:text-pastelOrange transition" href="#">בית</a>
          <a className="hover:text-pastelOrange transition" href="#">על מיקה</a>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-pastelOrange transition outline-none">
              קטגוריות
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent dir="rtl">
              {categories.map((category) => (
                <DropdownMenuItem key={category.slug} asChild>
                  <Link to={`/category/${category.slug}`}>
                    {category.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <a className="hover:text-pastelOrange transition" href="#">מועדפים</a>
        </nav>
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
          <CategoryCards />
        </div>
      </div>
      {/* On mobile, categories below */}
      <div className="block lg:hidden px-8 py-4">
        <CategoryCards />
      </div>
    </main>
  );
};

export default Index;
