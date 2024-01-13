import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.collection.create({
        data: {
          name: input.name,
          descriptionMd: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
          topic: { connect: { id: 1 } },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.collection.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getAllCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.collection.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
});
