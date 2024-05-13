import { auth } from "@/auth";
import Search from "@/components/forms/Search";
import { redirect } from "next/navigation";

const Home: React.FC = async (props) => {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="flex h-screen w-[90vw] flex-col items-center justify-between p-24 ">
      <div className="flex flex-wrap items-center justify-center w-full ">
        <Search
          filterTarget="simsId"
          filterPlaceholder="Search for SIMSID..."
          endpoint="/api/addUser"
        />
      </div>
    </main>
  );
};

export default Home;
