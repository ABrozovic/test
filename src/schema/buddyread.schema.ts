import z from "zod";
import { readingProgressSchema } from "./readingProgress.schema";
export const buddyReadSchema = z.object({
  book: z.string({ required_error: "Book is required" }),
  users: z.array(z.string()),
});

export const buddyReadProgress = z.object({
  buddyReadId: z.string(),
  progress: readingProgressSchema,  
});
export const getSingleBuddyReadSchema = z.object({ buddyReadId: z.string() });
export type CreateBuddyReadInput = z.TypeOf<typeof buddyReadSchema>;
