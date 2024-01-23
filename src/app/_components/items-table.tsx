"use client";

import { api } from "~/trpc/react";

type Props = {
  collectionId: number;
};

export default function ItemsTable({ collectionId }: Props) {
  const { data: items } = api.item.getAllInCollection.useQuery(collectionId);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>name</th>
          <th>tags</th>
        </tr>
      </thead>
      <tbody>
        {items
          ?.sort((x, y) => x.name.localeCompare(y.name))
          .map((item) => (
            <tr key={item.id}>
              <th>{item.name}</th>
              <th>{item.tags.map((x) => x.name).join(", ")}</th>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
