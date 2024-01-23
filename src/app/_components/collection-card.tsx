import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  description: string;
  topic: string;
  imageUrl?: string | null;
  collectionId: number;
};

export default function CollectionCard({
  name,
  description,
  topic,
  imageUrl,
  collectionId,
}: Props) {
  return (
    <div className="card card-side card-compact w-96 rounded-lg bg-base-200 shadow">
      {imageUrl && (
        <figure className="h-28">
          <Image
            width={28 * 4}
            height={28 * 4}
            src={imageUrl}
            alt="collection image"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">
          <Link href={`/collection/${collectionId}`}>{name}</Link>
          <div className="badge badge-outline bg-base-100">{topic}</div>
        </h2>

        <p className="whitespace-pre-wrap break-words">{description}</p>
      </div>
    </div>
  );
}
