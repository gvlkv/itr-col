import { api } from "~/trpc/server";
import CollectionCard from "~/app/_components/collection-card";
import NewItemForm from "~/app/_components/new-item-form";
import NotFoundCollection from "~/app/_components/not-found-collection";
import ItemsTable from "~/app/_components/items-table";

export default async function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const collectionId = Number(params.id);
  if (isNaN(collectionId)) return <NotFoundCollection />;
  const collection = await api.collection.getById.query(collectionId);
  if (!collection) return <NotFoundCollection />;
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <CollectionCard
        collectionId={collection.id}
        name={collection.name}
        description={collection.descriptionMd}
        topic={collection.topic.name}
        imageUrl={collection.image}
      />
      <ItemsTable collectionId={collection.id} />
      <NewItemForm collection={collection} />
    </div>
  );
}
