"use client";

import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import { type Dispatch, type SetStateAction, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { setLengthWith } from "~/util/array";
import type { UserField } from "~/server/api/routers/collection";

export default function CreateCollectionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<number>(1);
  const [selectedTypes, setSelectedTypes] = useState<UserField[]>([]);
  const selectTopicId = useId();
  const selectFieldsNumberId = useId();

  const allNumbers = [...Array(16).keys()];

  const createCollection = api.collection.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
    },
    onError: (e) => {
      const messages = JSON.parse(e.message) as [{ message: string }]; // TODO: is there a better way?
      messages.forEach((message) => toast.error(message.message));
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
          types: selectedTypes,
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
        <label htmlFor={selectTopicId}>Topic:</label>
        <select
          value={selectedTopic}
          onChange={(e) => {
            setSelectedTopic(+e.target.value);
          }}
          id={selectTopicId}
          className="select select-bordered"
        >
          {topics.data?.map((topic) => (
            <option value={topic.id} key={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row items-baseline gap-4">
        <label htmlFor={selectFieldsNumberId}>Extra fields:</label>
        <select
          value={selectedTypes.length}
          onChange={(e) => {
            setSelectedTypes(
              setLengthWith(selectedTypes, +e.target.value, {
                name: "",
                type: -1, // Empty
              }),
            );
          }}
          id={selectFieldsNumberId}
          className="select select-bordered"
        >
          {allNumbers.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <OptionalFieldsEdit
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />
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

function OptionalFieldsEdit({
  selectedTypes,
  setSelectedTypes,
}: {
  selectedTypes: UserField[];
  setSelectedTypes: Dispatch<SetStateAction<UserField[]>>;
}) {
  function typeIsAllowed(n: number): boolean {
    return selectedTypes.filter((x) => Number(x.type === n)).length < 3;
  }

  const allowedTypes = [0, 1, 2, 3, 4].filter(typeIsAllowed);

  return (
    <div className="flex flex-col gap-2">
      {selectedTypes.map((type, i) => (
        <OptionalFieldEdit
          {...{ allowedTypes }}
          selectedType={type}
          setSelectedType={(newType) => {
            if (typeof newType !== "function") {
              setSelectedTypes((x) => {
                const y = [...x];
                y[i] = newType;
                return y;
              });
            } else {
              setSelectedTypes((x) => {
                const y = [...x];
                y[i] = newType(y[i]!);
                return y;
              });
            }
          }}
          key={i}
        />
      ))}
    </div>
  );
}

function OptionalFieldEdit({
  allowedTypes,
  selectedType,
  setSelectedType,
}: {
  selectedType: UserField;
  setSelectedType: Dispatch<SetStateAction<UserField>>;
  allowedTypes: number[];
}) {
  const id = useId();

  return (
    <div className="flex flex-row items-baseline gap-4">
      <input
        type="text"
        className="input input-bordered w-full"
        value={selectedType.name}
        onChange={(e) => {
          setSelectedType({ ...selectedType, name: e.target.value });
        }}
      />
      <label htmlFor={id}>of&nbsp;type</label>
      <select
        id={id}
        className="select select-bordered"
        value={selectedType.type}
        onChange={(e) => {
          setSelectedType({ ...selectedType, type: +e.target.value });
        }}
      >
        <option value="-1">&mdash;</option>
        <option value="0" disabled={!allowedTypes.includes(0)}>
          Boolean
        </option>
        <option value="1" disabled={!allowedTypes.includes(1)}>
          Date
        </option>
        <option value="2" disabled={!allowedTypes.includes(2)}>
          Integer
        </option>
        <option value="3" disabled={!allowedTypes.includes(3)}>
          String
        </option>
        <option value="4" disabled={!allowedTypes.includes(4)}>
          Text
        </option>
      </select>
    </div>
  );
}
