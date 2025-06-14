
import React from "react";
import { Leaf, Cookie } from "lucide-react"; // Removed Star, Utensils as they are not used
import { Button } from "@/components/ui/button"; // Corrected path for shadcn ui components
import { useToast } from "@/hooks/use-toast"; // Import useToast

const picks = [
  {
    label: "עלי גפן",
    desc: "עלי גפן ממולאים באורז וירקות, מתכון משפחתי",
    price: "₪6.50 למנה",
    img: "/lovable-uploads/1ccfb5d5-09ee-4b54-8cdc-7af66df9703b.png",
    icon: <Leaf className="w-5 h-5 text-green-600" />
  },
  {
    label: "עוגיות שוקולד צ'יפס",
    desc: "עוגיות נימוחות עם המון שוקולד צ'יפס",
    price: "₪35 למארז",
    img: "/lovable-uploads/4987dbcd-1e75-4507-80c7-b7fc9ca1f7ee.png",
    icon: <Cookie className="w-5 h-5 text-yellow-600" />
  },
];

const RecipePicks: React.FC = () => {
  const { toast } = useToast();

  const handleShowRecipe = (recipeName: string) => {
    console.log(`Attempting to show recipe for: ${recipeName}`);
    toast({
      title: "בקרוב!",
      description: `המתכון עבור ${recipeName} יתווסף בקרוב.`,
    });
  };

  return (
    <section className="bg-white rounded-3xl shadow-lg p-7 mt-8" dir="rtl">
      <h2 className="font-fredoka text-2xl mb-4 text-choco">מומלצים</h2>
      <div className="flex flex-col gap-4">
        {picks.map((pick) => (
          <div className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/20" key={pick.label}>
            <img src={pick.img} alt={pick.label} className="w-16 h-16 object-cover rounded-xl border-2 border-pastelYellow shadow" />
            <div>
              <div className="flex items-center gap-2 font-fredoka text-lg text-choco flex-row">
                {pick.icon}
                <span>{pick.label}</span>
              </div>
              <div className="text-choco/80 text-sm">{pick.desc}</div>
            </div>
            <Button
              size="sm"
              onClick={() => handleShowRecipe(pick.label)}
              className="mr-auto bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold"
            >
              הצג מתכון
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipePicks;
