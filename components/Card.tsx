import React from "react";

interface Props {
  imie: string | undefined;
  adres: string;
  simsid: string | null | undefined;
}

const Card = async ({ imie, adres, simsid }: Props) => {
  return (
    <main className="flex h-[20vh] w-[20vw] p-2">
      <div className="bg-white w-full h-full flex flex-col items-center justify-center text-black  rounded-md hover:scale-105">
        <h1 className="font-bold">{imie}</h1>
        <h1 className="font-bold">{adres}</h1>
        <h1 className="font-bold">{simsid}</h1>
        <input
          className="border border-black text-center"
          type="text"
          content={adres}
        />
      </div>
    </main>
  );
};

export default Card;
