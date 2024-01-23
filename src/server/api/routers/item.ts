import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({
  getAllInCollection: publicProcedure
    .input(z.number())
    .query(({ ctx, input }) => {
      return ctx.db.item.findMany({
        orderBy: { createdAt: "desc" },
        where: { collectionId: input },
        include: { tags: true },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Item name should be non-empty."),
        collectionId: z.number(),
        tags: z.string().array(),
        bools: z.boolean().array(),
        dates: z.date().array(),
        ints: z.number().array(),
        strs: z.string().array(),
        texts: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findUnique({
        where: {
          id: input.collectionId,
        },
      });

      if (collection?.createdById !== ctx.session.user.id) {
        throw new Error(
          "User doesnt own collection provided or it doesnt exist.",
        );
      }

      await ctx.db.$transaction([
        ctx.db.tag.deleteMany({
          where: {
            name: {
              in: input.tags,
            },
          },
        }),
        ctx.db.tag.createMany({
          data: input.tags.map((x) => {
            return {
              name: x,
            };
          }),
        }),
      ]);

      const tags = await ctx.db.tag.findMany({
        where: {
          name: {
            in: input.tags,
          },
        },
      });

      await ctx.db.item.create({
        data: {
          name: input.name,
          tags: {
            connect: tags,
          },
          collectionId: input.collectionId,
          boolValue1: collection.optBoolEnabled1 ? input.bools[0] : null,
          boolValue2: collection.optBoolEnabled2 ? input.bools[1] : null,
          boolValue3: collection.optBoolEnabled3 ? input.bools[2] : null,
          intValue1: collection.optIntEnabled1 ? input.ints[0] : null,
          intValue2: collection.optIntEnabled2 ? input.ints[1] : null,
          intValue3: collection.optIntEnabled3 ? input.ints[2] : null,
          strValue1: collection.optStrEnabled1 ? input.strs[0] : null,
          strValue2: collection.optStrEnabled2 ? input.strs[1] : null,
          strValue3: collection.optStrEnabled3 ? input.strs[2] : null,
          textValue1: collection.optTextEnabled1 ? input.texts[0] : null,
          textValue2: collection.optTextEnabled2 ? input.texts[1] : null,
          textValue3: collection.optTextEnabled3 ? input.texts[2] : null,
          dateValue1: collection.optDateEnabled1 ? input.dates[0] : null,
          dateValue2: collection.optDateEnabled2 ? input.dates[1] : null,
          dateValue3: collection.optDateEnabled3 ? input.dates[2] : null,
        },
      });
    }),
});
