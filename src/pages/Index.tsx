
// דף הבית של ספר המתכונים של מיקה

import MikaHero from "../components/MikaHero";
import CategoryCards from "../components/CategoryCards";
import RecipePicks from "../components/RecipePicks";

const Index = () => {
  return (
    <main className="min-h-screen w-full flex flex-col" style={{background: "#faf9f7", direction: "rtl"}}>
      {/* Header / Navbar */}
      <header className="w-full flex items-center justify-between py-7 px-8 bg-white border-b border-gray-100 shadow-sm flex-row" dir="rtl">
        {/* Main title and logo on the right */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <div className="w-10 h-10 rounded-full bg-pastelYellow flex items-center justify-center font-fredoka text-xl shadow-inner border">
            מ
          </div>
          <span className="font-fredoka text-2xl text-choco tracking-tight">ספר המתכונים של מיקה</span>
        </div>
        {/* Categories navigation on the left */}
        <nav className="flex gap-7 font-fredoka text-choco text-lg flex-row">
          <a className="hover:text-pastelOrange transition" href="#">בית</a>
          <a className="hover:text-pastelOrange transition" href="#">על מיקה</a>
          <a className="hover:text-pastelOrange transition" href="#">קטגוריות</a>
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
