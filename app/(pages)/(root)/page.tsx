import Search from "@/components/forms/Search";



const Home: React.FC = (props) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap items-center justify-center">
        <Search
          filterTarget="simsId"
          filterPlaceholder="Search for SIMSID..."
          endpoint="/api/getAllUsers"
        />
      </div>
    </main>
  );
};

export default Home;