import Search from "@/components/forms/Search";

const Home = () => {
  return (
    <main className="flex h-screen w-[90vw] flex-col items-center justify-between p-24">
      <div className="flex flex-wrap items-center justify-center w-full">
        <Search
          filterTarget="address"
          filterPlaceholder="Search for Address..."
          endpoint="api/assignIp"
          cols="ip"
        />
      </div>
    </main>
  );
};

export default Home;
