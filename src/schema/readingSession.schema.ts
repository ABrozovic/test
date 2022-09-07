import { z } from "zod";

const readingSessionSchema = z.object({
  userId: z.string({ required_error: "UserId is required." }),
  bookId: z.string({ required_error: "BookId is required." }),
  startDate: z.string({ required_error: "StartDate is required." }),
  endDate: z.string({ required_error: "EndDate is required." }),
  readingSessionId: z.string({
    required_error: "ReadingSessionId is required.",
  }),
});

export type createReadingSessionInput = z.TypeOf<typeof readingSessionSchema>;

const ReadingSessionCollectionSchema = z.object({
  readingSessionId: z.string({
    required_error: "ReadingSessionId is required.",
  }),
});

export type createReadingSessionCollectionInput = z.TypeOf<
  typeof ReadingSessionCollectionSchema
>;
