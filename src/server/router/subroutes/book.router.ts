import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createBookSchema } from "../../../schema/book.schema";
import { createRouter } from "../trpc/context";



export const bookRouter = createRouter().mutation("create-book", {
  input: createBookSchema.extend({image:z.string().optional(), hostedLink:z.string().optional()}),
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
});
