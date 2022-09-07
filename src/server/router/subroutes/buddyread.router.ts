import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  buddyReadProgress,
  getSingleBuddyReadSchema,
} from "../../../schema/buddyread.schema";
import { createRouter } from "../trpc/context";

const buddyReadRouter = createRouter()
  .query("get-active-buddyreads", {
    async resolve({ ctx }) {
      try {
        return await ctx.prisma.buddyRead.findMany({
          where: {
            endDate: {
              gte: new Date().toISOString(),
            },
          },
          include: {
            book: true,
            // user: true,            
            // comment: true,
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
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    return next();
  })
  .query("get-single-buddyread", {
    input: getSingleBuddyReadSchema,
    async resolve({ ctx, input }) {
      if (!input.buddyReadId) return;
      const user = ctx.session?.user?.id as string;
      try {
        return await ctx.prisma.buddyRead.findUnique({
          where: {
            id: input.buddyReadId,
          },
          include: {
            book: true,
            user: {
              select: {
                id: true,
                ReadingProgress: true,
              },
              where: {
                id: user,
              },
            },
            comment: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
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

  .mutation("join-buddyread", {
    input: z.object({ buddyReadId: z.string() }),
    async resolve({ ctx, input }) {
      const user = ctx.session?.user?.id as string;
      try {
        await ctx.prisma.buddyRead.update({
          where: {
            id: input.buddyReadId,
          },
          data: {
            user: {
              connect: {
                id: user,
              },
            },
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
  .mutation("update-reading-progress", {
    input: buddyReadProgress,
    async resolve({ ctx, input }) {
      const userId = ctx.session?.user?.id as string;
      try {
        await ctx.prisma.buddyRead.update({
          where: {
            id: input.buddyReadId,
          },
          data: {
            book: {
              update: {
                ReadingProgress: {
                  upsert: {
                    create: {
                      pagesRead: input.progress.pagesRead,
                      fullyRead: input.progress.fullyRead,
                      userId,
                    },
                    update: {
                      pagesRead: input.progress.pagesRead,
                      fullyRead: input.progress.fullyRead,
                    },
                    where: {
                      userId_bookId: {
                        userId,
                        bookId: input.progress.bookId,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

export default buddyReadRouter;
