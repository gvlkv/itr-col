"use client";

import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import {
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type ChangeEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { setLengthWith } from "~/util/array";
import type { UserField } from "~/server/api/routers/collection";
import { uploadFileToS3 } from "~/util/upload";

export default function CreateCollectionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<UserField[]>([]);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imageInputKey, setImageInputKey] = useState("");

  const allNumbers = [...Array(16).keys()];

  const createCollection = api.collection.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setDescription("");
      setSelectedTopic(1);
      setSelectedTypes([]);
      setImage(undefined);
      // force file input field to rerender
      setImageInputKey(Math.random().toString(36));
    },
    onError: (e) => {
      const messages = JSON.parse(e.message) as [{ message: string }]; // TODO: is there a better way?
      messages.forEach((message) => toast.error(message.message));
    },
  });

  const createPresignedImageUrl =
    api.collection.createPresignedImageUrl.useMutation().mutateAsync;

  const topics = api.collection.getTopics.useQuery();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevent page refresh

    let uploadData = undefined;
    if (image?.name) {
      try {
        uploadData = await createPresignedImageUrl({});
        await uploadFileToS3(uploadData.url, uploadData.fields, image);
      } catch (error) {
        toast.error((error as Error).message); // TODO
      }
    }

    createCollection.mutate({
      name,
      description,
      topic: Number(selectedTopic),
      types: selectedTypes,
      image: uploadData && uploadData.url + uploadData.fields.key,
    });
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target?.files?.[0];
    setImage(selectedFile);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-xs flex-col gap-2 rounded-lg bg-base-200 p-4 shadow"
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
      <label>
        <div className="flex flex-row items-baseline gap-2">
          Image:
          <input
            type="file"
            className="file-input file-input-bordered file-input-ghost  file-input-sm w-full max-w-xs bg-base-100"
            accept="image/*"
            key={imageInputKey}
            onChange={onFileChange}
          />
        </div>
      </label>
      <label>
        <div className="flex flex-row items-baseline gap-2">
          Topic:
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(+e.target.value);
            }}
            className="select select-bordered select-sm"
          >
            {topics.data?.map((topic) => (
              <option value={topic.id} key={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>
      </label>
      <label>
        <div className="flex flex-row items-baseline gap-2">
          Extra fields:
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
            className="select select-bordered select-sm"
          >
            {allNumbers.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </div>
      </label>
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
    <div className="flex flex-col gap-2 py-2">
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
  return (
    <div className="flex flex-row items-baseline gap-2">
      <input
        type="text"
        className="input input-bordered input-sm w-full"
        value={selectedType.name}
        onChange={(e) => {
          setSelectedType({ ...selectedType, name: e.target.value });
        }}
      />
      <label>of&nbsp;type</label>
      <select
        className="select select-bordered select-sm"
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
