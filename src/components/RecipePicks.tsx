
import React from "react";
import { CakeSlice, Star } from "lucide-react";

const picks = [
  {
    label: "Honey Bun",
    desc: "Fluffy bun with sweet honey glaze",
    price: "$4.99/ea",
    img: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80", // placeholder
    icon: <CakeSlice className="w-5 h-5 text-pastelOrange" />
  },
  {
    label: "Melon Bun",
    desc: "Light bun with smooth melon filling",
    price: "$5.50/ea",
    img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80", // placeholder
    icon: <Star className="w-5 h-5 text-pastelYellow" />
  },
];

const RecipePicks: React.FC = () => (
  <section className="bg-white rounded-3xl shadow-lg p-7 mt-8">
    <h2 className="font-fredoka text-2xl mb-4 text-choco">Top-5 Picks</h2>
    <div className="flex flex-col gap-4">
      {picks.map((pick, i) => (
        <div className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/20" key={pick.label}>
          <img src={pick.img} alt={pick.label} className="w-16 h-16 object-cover rounded-xl border-2 border-pastelYellow shadow" />
          <div>
            <div className="flex items-center gap-2 font-fredoka text-lg text-choco">
              {pick.icon}
              <span>{pick.label}</span>
            </div>
            <div className="text-choco/80 text-sm">{pick.desc}</div>
          </div>
          <span className="ml-auto font-bold text-choco bg-pastelBlue px-3 py-1 rounded-lg">{pick.price}</span>
        </div>
      ))}
    </div>
  </section>
);

export default RecipePicks;
