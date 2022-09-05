import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { readingProgressSchema } from "../../../schema/readingProgress.schema";
import { customUserAuthSchema } from "../../../schema/user.schema";
import { createRouter } from "../trpc/context";

export const userRouter = createRouter()
  .mutation("register-user", {
    input: customUserAuthSchema,
    async resolve({ ctx, input }) {
      const { username, password } = input;
      const exists = await ctx.prisma.customUser.findFirst({
        where: { username },
      });
      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      try {
        return await ctx.prisma.customUser.create({
          data: {
            username: username,
            password: hashedPassword,
          },
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        });
      }
    },
  })
  .mutation("login-user", {
    input: customUserAuthSchema,
    async resolve({ ctx, input }) {
      const { username } = input;
      const exists = await ctx.prisma.customUser.findFirst({
        where: { username },
      });
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Username or password is incorrect",
        });
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.customUser.findMany();
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
  .query("get-self", {
    async resolve({ ctx }) {
      const user = ctx.session?.user;
      return await ctx.prisma.customUser.findUnique({
        where: { id: user?.id },
        include: {
          ReadingProgress: true,
        },
      });
    },
  })
  .mutation("update-self-readingprogress", {
    input: readingProgressSchema,
    async resolve({ ctx, input }) {
      const user = ctx.session?.user;
      console.log(user, input);
      try {
        return await ctx.prisma.customUser.update({
          where: { id: user?.id as string },
          data: {
            ReadingProgress: {
              connectOrCreate: [
                {
                  where: {
                    userId_bookId: {
                      userId: user?.id as string,
                      bookId: input.bookId as string,
                    },
                  },
                  create: {
                    fullyRead: input.fullyRead,
                    pagesRead: input.pagesRead,
                    bookId: input.bookId as string,
                  },
                },
              ],

              update: {
                where: {
                  userId_bookId: {
                    userId: user?.id as string,
                    bookId: input.bookId as string,
                  },
                },
                data: {
                  fullyRead: input.fullyRead,
                  pagesRead: input.pagesRead,
                  bookId: input.bookId as string,
                },
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
