
import React from "react";

const MikaHero: React.FC = () => (
  <section className="relative bg-pastelYellow rounded-3xl shadow-lg p-8 flex flex-col items-center w-full h-full min-h-[380px] justify-center overflow-hidden" dir="rtl">
    <div className="absolute right-8 bottom-8 flex flex-col items-end">
      <span className="bg-white/80 text-choco font-fredoka text-xl px-4 py-1 rounded-full shadow">הכירו את מיקה!</span>
      <span
        className="text-choco text-[2.7rem] font-fredoka font-extrabold leading-tight mt-3"
        style={{ textShadow: '0 2px 0 #fff9ea' }}
      >
        מיקה - שפית <span className="text-pastelOrange">צעירה</span> בת 14
      </span>
    </div>
    <div className="flex flex-col items-center mt-8">
      <img
        src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=facearea&w=600&h=600&facepad=2&q=90"
        alt="עוגיות שוקולד צ'יפס"
        className="w-64 h-64 object-cover border-4 border-white shadow-lg"
        style={{ marginBottom: "-3rem", marginTop: "1rem" }}
      />
      <p className="mt-8 text-lg text-choco text-center max-w-lg">
        מיקה היא בת ה-14 של המשפחה וכבר אלופה גדולה במטבח! האהבה הכי גדולה שלה היא <span className="font-bold text-pastelOrange">קונדיטוריה</span> ו-<span className="font-bold text-pastelYellow">מאפים</span>. כאן תמצאו את כל המתכונים הכי שווים שלה – מתוקים, מלוחים וביתיים.
      </p>
    </div>
  </section>
);

export default MikaHero;

