import heroImg from "@/public/gifs/401_unauthorized.gif";
import Image from "next/image";

const Unathorized = () => {
  return (
    <div className="w-screen flex flex-col gap-5 items-center justify-center h-screen">
      <Image
        src={heroImg}
        className="rounded-sm"
        alt="YOU SHALL NOT PASS"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default Unathorized;
