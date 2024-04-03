import Search from "@/components/forms/Search";

export default async function Home({ ...props }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-wrap items-center justify-center">
        <Search />
      </div>
    </main>
  );
}
