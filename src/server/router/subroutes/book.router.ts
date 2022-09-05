import { TRPCError } from "@trpc/server";

import {
  createBookSchema,
  getSingleBookSchema,
} from "../../../schema/book.schema";
import { createRouter } from "../trpc/context";

export const bookRouter = createRouter()
  .mutation("create-book", {
    input: createBookSchema,
    async resolve({ ctx, input }) {
      const {
        title,
        author,
        description,
        image,
        hostedLink,
        externalLink,
        ownerId,
      } = input;
      try {
        await ctx.prisma.book.create({
          data: {
            title,
            author,
            description,
            image: image,
            hostedLink,
            externalLink,
            ownerId,
            isActive: false,
          },
        });
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    },
  })
  .query("get-single-book", {
    input: getSingleBookSchema,
    async resolve({ ctx, input }) {
      if (!input.bookId) return;
      try {
        return await ctx.prisma.book.findUnique({
          where: {
            id: input.bookId,
          },
          include: {
            buddyReads: true,
          },
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    },
  })
  .query("get-all-books", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.book.findMany();
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    },
  });
