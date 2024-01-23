import { api } from "~/trpc/server";
import CollectionCard from "~/app/_components/collection-card";

export default async function CollectionsShowcase() {
  const collections = await api.collection.getAll.query();
  return (
    <div className="flex flex-row flex-wrap items-start justify-center gap-2">
      {collections.map((col) => (
        <CollectionCard
          key={col.id}
          collectionId={col.id}
          name={col.name}
          description={col.descriptionMd}
          topic={col.topic.name}
          imageUrl={col.image}
        />
      ))}
    </div>
  );
}
