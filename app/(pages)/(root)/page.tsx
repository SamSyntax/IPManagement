import Search from "@/components/forms/Search";

const Home: React.FC = (props) => {
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
