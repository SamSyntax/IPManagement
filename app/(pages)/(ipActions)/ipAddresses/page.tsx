import Search from "@/components/forms/Search";

const Home: React.FC = ({ ...params }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap items-center justify-center">
        <Search
          filterTarget="address"
          filterPlaceholder="Search for Address..."
          endpoint="api/getIps"
          cols="ip"
        />
      </div>
    </main>
  );
};

export default Home;
