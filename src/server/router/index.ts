// src/server/router/index.ts
import { createRouter } from "./trpc/context";
import superjson from "superjson";
import { bookRouter } from "./subroutes/book.router";
import { authRouter } from "./subroutes/auth.router";
import { userRouter } from "./subroutes/user.router";
import buddyReadRouter from "./subroutes/buddyread.router";
import { commentRouter } from "./subroutes/comments.router";


export const appRouter = createRouter()
  .transformer(superjson)
  .merge("books.", bookRouter)
  .merge("auth.", authRouter)
  .merge("users.", userRouter)
  .merge("buddyreads.", buddyReadRouter)
  .merge("comments.", commentRouter)


// export type definition of API
export type AppRouter = typeof appRouter;
