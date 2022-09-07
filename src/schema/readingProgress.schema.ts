import { z } from "zod";
export const readingProgressSchema = z.object({
  pagesRead: z.number({
    required_error: "Input a number.",
    invalid_type_error: "You must  enter a number",
  }),
  fullyRead: z.boolean({
    required_error: "isActive is required",
    invalid_type_error: "isActive must be a boolean",
  }),
  bookId: z.string(),
});

export type readingProgressInput = z.TypeOf<typeof readingProgressSchema>;
