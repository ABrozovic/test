import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../trpc/context";

export const commentRouter = createRouter()
  .query("all-comments", {
    input: z.object({
      buddyReadId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { buddyReadId } = input;

      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {                        
            buddyRead: {
              id: buddyReadId,
            },
          },
          include: {            
            user: true,                                        
          },
        });

        return comments;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next();
  })
  .mutation("add-comment", {
    input: z.object({
      body: z.string(),
      readingProgress: z.number(),
      buddyReadId: z.string(),
      parentId: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const { body, buddyReadId, parentId } = input;

      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            message: body,
            readingProgress: input.readingProgress,
            buddyRead: {
              connect: {
                id: buddyReadId,
              },
            },
            user: {
              connect: {
                id: user?.id,
              },
            },
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });
        return comment;
      } catch (e) {
        console.log(e);

        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    },
  });
