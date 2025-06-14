
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const picks = [
  {
    id: "e2c6f9g7-9d7e-5g3c-0b2c-4f3e5g6h7i8j",
    label: "עלי גפן ממולאים",
    desc: "עלי גפן ממולאים באורז ועשבי תיבול, מבושלים ברוטב חמוץ-מתוק.",
    img: "/lovable-uploads/1ccfb5d5-09ee-4b54-8cdc-7af66df9703b.png",
    icon: <Leaf className="w-5 h-5 text-green-600" />
  },
  {
    id: "f3d7g0h8-0e8f-6h4d-1c3d-5g4f6h7i8j9k",
    label: "עוגיות שוקולד צ'יפס מושלמות",
    desc: "המתכון האולטימטיבי לעוגיות שוקולד צ'יפס, רכות מבפנים וקריספיות בשוליים.",
    img: "/lovable-uploads/4987dbcd-1e75-4507-80c7-b7fc9ca1f7ee.png",
    icon: <Cookie className="w-5 h-5 text-yellow-600" />
  },
];

const RecipePicks: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl shadow-lg p-7 mt-8" dir="rtl">
      <h2 className="font-fredoka text-2xl mb-4 text-choco">מומלצים</h2>
      <div className="flex flex-col gap-4">
        {picks.map((pick) => (
          <div className="flex items-center gap-4 p-3 rounded-xl bg-pastelYellow/20" key={pick.id}>
            <img src={pick.img} alt={pick.label} className="w-16 h-16 object-cover rounded-xl border-2 border-pastelYellow shadow" />
            <div>
              <div className="flex items-center gap-2 font-fredoka text-lg text-choco flex-row">
                {pick.icon}
                <span>{pick.label}</span>
              </div>
              <div className="text-choco/80 text-sm">{pick.desc}</div>
            </div>
            <Button
              asChild
              size="sm"
              className="mr-auto bg-pastelBlue hover:bg-pastelBlue/90 text-choco font-bold"
            >
              <Link to={`/recipe/${pick.id}`}>
                הצג מתכון
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecipePicks;
