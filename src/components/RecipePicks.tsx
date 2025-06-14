
import React from "react";
import { Leaf, Cookie, Star, Utensils } from "lucide-react"; // Added Leaf and Cookie, Utensils

const picks = [
  {
    label: "עלי גפן",
    desc: "עלי גפן ממולאים באורז וירקות, מתכון משפחתי",
    price: "₪6.50 למנה", // Updated price
    img: "/lovable-uploads/1ccfb5d5-09ee-4b54-8cdc-7af66df9703b.png", // Updated image for grape leaves
    icon: <Leaf className="w-5 h-5 text-green-600" /> // Changed icon
  },
  {
    label: "עוגיות שוקולד צ'יפס",
    desc: "עוגיות נימוחות עם המון שוקולד צ'יפס",
    price: "₪35 למארז", // Updated price
    img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80", // Using the provided image for cookies
    icon: <Cookie className="w-5 h-5 text-yellow-600" /> // Changed icon
  },
];

const RecipePicks: React.FC = () => (
  <section className="bg-white rounded-3xl shadow-lg p-7 mt-8" dir="rtl">
    <h2 className="font-fredoka text-2xl mb-4 text-choco">מומלצים</h2>
    <div className="flex flex-col gap-4">
      {picks.map((pick, i) => (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/20" key={pick.label}>
          <img src={pick.img} alt={pick.label} className="w-16 h-16 object-cover rounded-xl border-2 border-pastelYellow shadow" />
          <div>
            <div className="flex items-center gap-2 font-fredoka text-lg text-choco flex-row"> {/* Changed flex-row-reverse to flex-row */}
              {pick.icon}
              <span>{pick.label}</span>
            </div>
            <div className="text-choco/80 text-sm">{pick.desc}</div>
          </div>
          <span className="mr-auto font-bold text-choco bg-pastelBlue px-3 py-1 rounded-lg">{pick.price}</span>
        </div>
      ))}
    </div>
  </section>
);

export default RecipePicks;
