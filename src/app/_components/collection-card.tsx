type Props = {
  name: string;
  description: string;
  topic: string;
};

export default async function CollectionCard({
  name,
  description,
  topic,
}: Props) {
  return (
    <div className="card bg-base-100 w-96 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">
          {name}
          <div className="badge badge-outline">{topic}</div>
        </h2>
        <p className="whitespace-pre-wrap break-words">{description}</p>
      </div>
    </div>
  );
}
