import { TRPCError } from "@trpc/server";
import { getSingleBuddyReadSchema } from "../../../schema/buddyread.schema";
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
  .query("get-single-buddyread", {
    input: getSingleBuddyReadSchema,
    async resolve({ ctx, input }) {
      if (!input.buddyReadId) return;
      try {
        return await ctx.prisma.buddyRead.findUnique({
          where: {
            id: input.buddyReadId,
          },

          include: {
            book: true,
            comment: {
              include: {
                user: true,
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
  });
export default buddyReadRouter;