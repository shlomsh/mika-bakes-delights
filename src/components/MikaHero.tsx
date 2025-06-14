
import React from "react";

const MikaHero: React.FC = () => (
  <section className="relative bg-pastelYellow rounded-3xl shadow-lg p-8 flex flex-col items-center w-full h-full min-h-[380px] justify-center overflow-hidden">
    <div className="absolute left-8 bottom-8 flex flex-col items-baseline">
      <span className="bg-white/80 text-choco font-fredoka text-xl px-4 py-1 rounded-full shadow">Meet Mika!</span>
      <span className="text-choco text-[2.4rem] font-fredoka font-bold leading-none mt-3" style={{textShadow: '0 2px 0 #fff9ea'}}>14-year-old <span className="text-pastelOrange">chef</span></span>
    </div>
    <div className="flex flex-col items-center mt-8">
      <img
        src="/lovable-uploads/a7bf2bc5-e9ca-40f6-82fd-ca8916ffc199.png"
        alt="Mika baking confectionery"
        className="w-64 h-64 object-cover border-4 border-white shadow-lg"
        style={{ marginBottom: "-3rem", marginTop: "1rem" }}
      />
      <p className="mt-8 text-lg text-choco text-center max-w-lg">
        Mika is the family’s 14-year-old kitchen prodigy! Baking is her big love—especially <span className="font-bold text-pastelOrange">confectionery</span> and <span className="font-bold text-pastelYellow">pastry</span>. This app is her recipe box—full of sweet, savory, and classic family dishes.
      </p>
    </div>
  </section>
);

export default MikaHero;
