import z from "zod";
export const buddyReadSchema = z.object({
  book: z.string({required_error:"Book is required"}),
  users: z.array(z.string()),
});
export type CreateBuddyReadInput = z.TypeOf<typeof buddyReadSchema>;
