import { customUserAuthSchema } from  "../../../schema/user.schema";
import { createRouter } from "../trpc/context";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";


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
        const user = await ctx.prisma.customUser.create({
          data: {
            username: username,
            password: hashedPassword,
          },
        });
        return user;
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
  });
