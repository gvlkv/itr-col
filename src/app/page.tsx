import CreateCollectionForm from "~/app/_components/create-collection-form";
import CollectionsShowcase from "~/app/_components/collections-showcase";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-2">
        {session && <CreateCollectionForm />}
        <CollectionsShowcase />
      </div>
    </main>
  );
}
