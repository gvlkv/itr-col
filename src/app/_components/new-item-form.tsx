"use client";

import {
  Fragment,
  type Dispatch,
  type SetStateAction,
  useState,
  type FormEvent,
} from "react";
import { type CollectionOutput } from "~/server/api/root";
import SubmitBtn from "./submit-btn";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "~/trpc/react";

export type UserOptType<T> = [T, T, T];

type Props = {
  collection: CollectionOutput;
};

export default function NewItemForm({ collection }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const boolStates = useState<UserOptType<boolean>>([false, false, false]);
  const dateStates = useState<UserOptType<Date>>([
    new Date(),
    new Date(),
    new Date(),
  ]);
  const intStates = useState<UserOptType<number>>([0, 0, 0]);
  const strStates = useState<UserOptType<string>>(["", "", ""]);
  const textStates = useState<UserOptType<string>>(["", "", ""]);

  const createItem = api.item.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setTags([]);
      boolStates[1]([false, false, false]);
      dateStates[1]([new Date(), new Date(), new Date()]);
      intStates[1]([0, 0, 0]);
      strStates[1](["", "", ""]);
      textStates[1](["", "", ""]);
    },
    onError: (e) => {
      const messages = JSON.parse(e.message) as [{ message: string }];
      messages.forEach((message) => toast.error(message.message));
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    createItem.mutate({
      name,
      tags: tags,
      collectionId: collection!.id,
      bools: boolStates[0],
      dates: dateStates[0],
      ints: intStates[0],
      strs: strStates[0],
      texts: textStates[0],
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-xs flex-col rounded-lg bg-base-200 p-4 shadow"
    >
      <label className="label">
        <span className="label-text">Name</span>
        <div className="px-2" />
        <input
          className="input input-bordered min-w-0"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className="label">
        <span className="label-text">Tags</span>
        <div className="px-2" />
        <input
          className="input input-bordered min-w-0"
          type="text"
          value={tags.join(",")}
          onChange={(e) =>
            setTags(e.target.value.split(",").map((x) => x.trim()))
          }
        />
      </label>
      <BoolFields collection={collection} state={boolStates} />
      <IntFields collection={collection} state={intStates} />
      <StrFields collection={collection} state={strStates} />
      <TextFields collection={collection} state={textStates} />
      <DateFields collection={collection} state={dateStates} />
      <SubmitBtn isLoading={createItem.isLoading} />
    </form>
  );
}

function BoolFields({
  collection,
  state: [state, setState],
}: {
  collection: CollectionOutput;
  state: [UserOptType<boolean>, Dispatch<SetStateAction<UserOptType<boolean>>>];
}) {
  const enabled = [
    collection?.optBoolEnabled1,
    collection?.optBoolEnabled2,
    collection?.optBoolEnabled3,
  ];
  const labels = [
    collection?.optBoolLabel1,
    collection?.optBoolLabel2,
    collection?.optBoolLabel3,
  ];
  function changeAtIndex(index: number, value: boolean) {
    const prevState = [...state];
    prevState[index] = value;
    setState([prevState[0]!, prevState[1]!, prevState[2]!]);
  }
  return (
    <>
      {enabled.map(
        (enable, index) =>
          enable && (
            <label key={index} className="label cursor-pointer">
              <span className="label-text">{labels[index]}</span>
              <div className="px-2" />
              <input
                className="checkbox"
                type="checkbox"
                checked={state[index]}
                onChange={() => changeAtIndex(index, !state[index])}
              />
            </label>
          ),
      )}
    </>
  );
}

function IntFields({
  collection,
  state: [state, setState],
}: {
  collection: CollectionOutput;
  state: [UserOptType<number>, Dispatch<SetStateAction<UserOptType<number>>>];
}) {
  const enabled = [
    collection?.optIntEnabled1,
    collection?.optIntEnabled2,
    collection?.optIntEnabled3,
  ];
  const labels = [
    collection?.optIntLabel1,
    collection?.optIntLabel2,
    collection?.optIntLabel3,
  ];
  function changeAtIndex(index: number, value: number) {
    const prevState = [...state];
    prevState[index] = value;
    setState([prevState[0]!, prevState[1]!, prevState[2]!]);
  }
  return (
    <>
      {enabled.map(
        (enable, index) =>
          enable && (
            <label key={index} className="label">
              <span className="label-text">{labels[index]}</span>
              <div className="px-2" />
              <input
                className="input input-bordered min-w-0"
                type="number"
                value={state[index]}
                onChange={(e) => changeAtIndex(index, +e.target.value)}
              />
            </label>
          ),
      )}
    </>
  );
}

function StrFields({
  collection,
  state: [state, setState],
}: {
  collection: CollectionOutput;
  state: [UserOptType<string>, Dispatch<SetStateAction<UserOptType<string>>>];
}) {
  const enabled = [
    collection?.optStrEnabled1,
    collection?.optStrEnabled2,
    collection?.optStrEnabled3,
  ];
  const labels = [
    collection?.optStrLabel1,
    collection?.optStrLabel2,
    collection?.optStrLabel3,
  ];
  function changeAtIndex(index: number, value: string) {
    const prevState = [...state];
    prevState[index] = value;
    setState([prevState[0]!, prevState[1]!, prevState[2]!]);
  }
  return (
    <>
      {enabled.map(
        (enable, index) =>
          enable && (
            <label key={index} className="label">
              <span className="label-text">{labels[index]}</span>
              <div className="px-2" />
              <input
                className="input input-bordered min-w-0"
                type="text"
                value={state[index]}
                onChange={(e) => changeAtIndex(index, e.target.value)}
              />
            </label>
          ),
      )}
    </>
  );
}

function TextFields({
  collection,
  state: [state, setState],
}: {
  collection: CollectionOutput;
  state: [UserOptType<string>, Dispatch<SetStateAction<UserOptType<string>>>];
}) {
  const enabled = [
    collection?.optTextEnabled1,
    collection?.optTextEnabled2,
    collection?.optTextEnabled3,
  ];
  const labels = [
    collection?.optTextLabel1,
    collection?.optTextLabel2,
    collection?.optTextLabel3,
  ];
  function changeAtIndex(index: number, value: string) {
    const prevState = [...state];
    prevState[index] = value;
    setState([prevState[0]!, prevState[1]!, prevState[2]!]);
  }
  return (
    <>
      {enabled.map(
        (enable, index) =>
          enable && (
            <Fragment key={index}>
              <label htmlFor={`id-textarea-${index}`} className="label">
                <span className="label-text">{labels[index]}</span>
              </label>
              <textarea
                id={`id-textarea-${index}`}
                className="textarea textarea-bordered"
                value={state[index]}
                onChange={(e) => changeAtIndex(index, e.target.value)}
              />
            </Fragment>
          ),
      )}
    </>
  );
}

function DateFields({
  collection,
  state: [state, setState],
}: {
  collection: CollectionOutput;
  state: [UserOptType<Date>, Dispatch<SetStateAction<UserOptType<Date>>>];
}) {
  const enabled = [
    collection?.optDateEnabled1,
    collection?.optDateEnabled2,
    collection?.optDateEnabled3,
  ];
  const labels = [
    collection?.optDateLabel1,
    collection?.optDateLabel2,
    collection?.optDateLabel3,
  ];
  function changeAtIndex(index: number, value: Date) {
    const prevState = [...state];
    prevState[index] = value;
    setState([prevState[0]!, prevState[1]!, prevState[2]!]);
  }
  return (
    <>
      {enabled.map(
        (enable, index) =>
          enable && (
            <label key={index} className="label">
              <span className="label-text">{labels[index]}</span>
              <div className="px-2" />
              <input
                className="input input-bordered min-w-0"
                type="date"
                value={state[index]?.toISOString().split("T")[0]}
                onChange={(e) => changeAtIndex(index, new Date(e.target.value))}
              />
            </label>
          ),
      )}
    </>
  );
}
