import { z } from "zod";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3 } from "~/server/aws";
import { env } from "~/env";
import { v4 } from "uuid";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import config from "~/util/config";
import { TRPCError } from "@trpc/server";

export const userFieldSchema = z.object({
  type: z.number(),
  name: z.string(),
});

export type UserField = z.TypeOf<typeof userFieldSchema>;

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Collection name should not be empty.")
          .max(
            config.collectionMaxNameLen,
            `Collection name length should be less than ${config.collectionMaxNameLen}.`,
          ),
        description: z
          .string()
          .min(1, "Collection description should not be empty.")
          .max(
            config.collectionMaxDescriptionLen,
            `Collection description length should be less than ${config.collectionMaxDescriptionLen}.`,
          ),
        topic: z.number(),
        types: z.array(userFieldSchema),
        image: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const enabledFields = {
        optBoolEnabled1: input.types.filter((x) => x.type === 0).length > 0,
        optBoolEnabled2: input.types.filter((x) => x.type === 0).length > 1,
        optBoolEnabled3: input.types.filter((x) => x.type === 0).length > 2,
        optDateEnabled1: input.types.filter((x) => x.type === 1).length > 0,
        optDateEnabled2: input.types.filter((x) => x.type === 1).length > 1,
        optDateEnabled3: input.types.filter((x) => x.type === 1).length > 2,
        optIntEnabled1: input.types.filter((x) => x.type === 2).length > 0,
        optIntEnabled2: input.types.filter((x) => x.type === 2).length > 1,
        optIntEnabled3: input.types.filter((x) => x.type === 2).length > 2,
        optStrEnabled1: input.types.filter((x) => x.type === 3).length > 0,
        optStrEnabled2: input.types.filter((x) => x.type === 3).length > 1,
        optStrEnabled3: input.types.filter((x) => x.type === 3).length > 2,
        optTextEnabled1: input.types.filter((x) => x.type === 4).length > 0,
        optTextEnabled2: input.types.filter((x) => x.type === 4).length > 1,
        optTextEnabled3: input.types.filter((x) => x.type === 4).length > 2,
      };
      const fildsNames = {
        optBoolLabel1: input.types.filter((x) => x.type === 0)[0]?.name,
        optBoolLabel2: input.types.filter((x) => x.type === 0)[1]?.name,
        optBoolLabel3: input.types.filter((x) => x.type === 0)[2]?.name,
        optDateLabel1: input.types.filter((x) => x.type === 1)[0]?.name,
        optDateLabel2: input.types.filter((x) => x.type === 1)[1]?.name,
        optDateLabel3: input.types.filter((x) => x.type === 1)[2]?.name,
        optIntLabel1: input.types.filter((x) => x.type === 2)[0]?.name,
        optIntLabel2: input.types.filter((x) => x.type === 2)[1]?.name,
        optIntLabel3: input.types.filter((x) => x.type === 2)[2]?.name,
        optStrLabel1: input.types.filter((x) => x.type === 3)[0]?.name,
        optStrLabel2: input.types.filter((x) => x.type === 3)[1]?.name,
        optStrLabel3: input.types.filter((x) => x.type === 3)[2]?.name,
        optTextLabel1: input.types.filter((x) => x.type === 4)[0]?.name,
        optTextLabel2: input.types.filter((x) => x.type === 4)[1]?.name,
        optTextLabel3: input.types.filter((x) => x.type === 4)[2]?.name,
      };
      return ctx.db.collection.create({
        data: {
          name: input.name,
          descriptionMd: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
          topic: { connect: { id: input.topic } },
          ...enabledFields,
          ...fildsNames,
          image: input.image,
        },
      });
    }),

  createPresignedImageUrl: protectedProcedure
    .input(z.object({}))
    .mutation(async ({}) => {
      try {
        const { url, fields } = await createPresignedPost(s3, {
          Bucket: env.AWS_IMAGES_BUCKET_NAME,
          Key: v4(),
          Expires: env.UPLOAD_TIME_LIMIT,
          Conditions: [
            ["starts-with", "$Content-Type", "image/"],
            ["content-length-range", 0, env.UPLOAD_MAX_FILE_SIZE],
          ],
        });
        return { url, fields };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error creating presigned image url.",
        });
      }
    }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.collection.findUnique({
      where: { id: input },
      include: { topic: true },
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.collection.findMany({
      orderBy: { createdAt: "desc" },
      include: { topic: true },
    });
  }),

  getAllCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.collection.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getTopics: publicProcedure.query(({ ctx }) => {
    return ctx.db.topic.findMany();
  }),
});
