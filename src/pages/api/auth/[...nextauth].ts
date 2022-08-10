import NextAuth, { DefaultUser, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from "../../../server/db/client";

import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    // async redirect({ url, baseUrl }) {
    //   console.log("redirect", url);
    //   if (url.startsWith("/signin")) return `${baseUrl}/api/restricted}`
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url
    //   return baseUrl
    // },
    jwt({ token, user }) {
      
      if (user) { 
        const userData:DefaultUser = {id: user.id, name: user.username as string, image: user.image};               
        return {
          user: userData,          
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          
        };
      }
      // if(user){
      // token.name = user.toString();
      // token.id = user.id;
      // console.log("zzzzzuser", user);
      // }
      // if(account){
      //   console.log("zzzzzzaccount", account);
      // }
      // if(profile){
      //   console.log("zzzzzzzzzzzzzprofile", profile);
      // }
      // console.log("zzzzztoken", token);
      return token;
    },

    session({ session, user, token }) {
      if (user && session.user) {
        session.user.id = user.id;
      }
      if (token && session.user) {        
        session.user = (token.user as DefaultUser);                  
        session.token = token;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  //adapter: PrismaAdapter(prisma),
  providers: [
    // DiscordProvider({
    //   clientId: (env.DISCORD_CLIENT_ID),
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Name",
          type: "text",
          placeholder: "Enter your name",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        // console.log(credentials);
        const user = await prisma.customUser.findFirst({
          where: {
            username: credentials?.username,
          },
        });

        if (!user) {
          return null;
        }
        const isValidPassword = await bcrypt.compare(
          (credentials?.password as string),
          user.password
        );

        // console.log(isValidPassword);
        if (!isValidPassword) {
          return null;
        }
        return user;
      },
    }),
  ],
  // events: {
  //   signIn: async (ctx) => {
  //     // console.log("zsignIn", ctx);
  //   },
  //   createUser: async (ctx) => {
  //     // console.log("zcreateuser", ctx);
  //   },
  //   session: async (ctx) => {
  //      //console.log("zsession", ctx);
  //   }
  // ,
  // linkAccount: async (ctx) => {
  //   // console.log("zlinkAccount", ctx);
  // },
  // updateUser: async (ctx) => {
  //   // console.log("zupdateUser", ctx);
  // }
  // },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },

};

export default NextAuth(authOptions);
