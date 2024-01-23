export default function UserPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div>User {params.id}</div>
      <div>
        Collections:
        <div></div>
      </div>
    </div>
  );
}
