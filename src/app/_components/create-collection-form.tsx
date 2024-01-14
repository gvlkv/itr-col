"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";
import trpcErrorMessage from "./trpc-error-message";

export default function CreateCollectionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<number>(1);
  const selectId = useId();

  const createCollection = api.collection.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
    },
    onError: (e) => {
      toast(trpcErrorMessage(e.message));
    },
  });

  const topics = api.collection.getTopics.useQuery();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createCollection.mutate({
          name,
          description,
          topic: Number(selectedTopic),
        });
      }}
      className="flex max-w-xs flex-col gap-2 p-2"
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered"
      />
      <div className="flex flex-row items-baseline gap-4">
        <label htmlFor={selectId}>Topic:</label>
        <select
          value={selectedTopic}
          onChange={(e) => {
            console.log(e.target.value);
            setSelectedTopic(+e.target.value);
          }}
          id={selectId}
          className="select select-bordered w-full"
        >
          {topics.data?.map((topic) => (
            <option value={topic.id} key={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={createCollection.isLoading}
      >
        {createCollection.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
