import { api } from "~/trpc/server";
import CollectionCard from "~/app/_components/collection-card";

export default async function CollectionsShowcase() {
  const collections = await api.collection.getAll.query();
  const topics = await api.collection.getTopics.query();
  const getTopicName = (id: number) => topics.find((x) => x.id === id)?.name;

  return (
    <div className="flex flex-row flex-wrap items-start justify-center gap-2">
      {collections.map((col) => (
        <CollectionCard
          key={col.id}
          name={col.name}
          description={col.descriptionMd}
          topic={getTopicName(col.topicId) ?? ""}
        />
      ))}
    </div>
  );
}
