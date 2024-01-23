import { collectionRouter } from "~/server/api/routers/collection";
import { itemRouter } from "./routers/item";
import { createTRPCRouter } from "~/server/api/trpc";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type CollectionOutput = RouterOutput["collection"]["getById"];
