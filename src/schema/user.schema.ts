import * as z from "zod";

export const customUserAuthSchema = z.object({
  username: z
    .string({ required_error: "Username is required." })
    .min(3, "Username must be at least 3 characters."),
  password: z
    .string({ required_error: "Password is required." })
    .min(4, "Password must be at least 4 characters.")
    .max(24, "Password must be at most 24 characters."),
});

export type RegisterUserInput = z.TypeOf<typeof customUserAuthSchema>;
