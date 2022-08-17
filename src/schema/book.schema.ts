import { z } from "zod";
const MAX_FILE_SIZE = 104857600;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/epub+zip",
];
function evaluateFiles<T>(files: T[], predicate: (x: T) => boolean): boolean {
  for (let i = 0; i < files.length; i++) {
    if (!predicate(files[i] as T)) {
      return false;
    }
  }
  return true;
}

export const validateBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(3, "Title must be at least 3 characters."),
  author: z.string().optional(),
  description: z.string().optional(),
  image: z
    .any()
    .refine(
      (files: FileList | string) =>
        typeof files === "string" ||
        evaluateFiles(Array.from(files), (file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      ".jpg, .jpeg, .png, and .webp files are accepted."
    ),

  externalLink: z.string().optional().or(z.literal("")),
  hostedLink: z
    .any()
    .refine(
      (files: FileList | string) =>
        typeof files === "string" ||
        evaluateFiles(Array.from(files), (file) =>
          ACCEPTED_FILE_TYPES.includes(file.type)
        ),
      { message: ` .pdf, .doc, and .epub files are accepted.` }
    )
    .refine(
      (files: FileList | string) =>
        typeof files === "string" ||
        evaluateFiles(Array.from(files), (file) => file.size < MAX_FILE_SIZE),
      `Max file size is 100MB.`
    ),
  ownerId: z.string({ required_error: "OwnerId is required." }),
});




export const createBookSchema = validateBookSchema.extend({
  image: z.string().optional(),
  hostedLink: z.string().optional(),
});

export const getSingleBookSchema = z.object({bookId:z.string()});

export const createBookReview = z.object({
  userId: z.string({ required_error: "UserId is required." }),
  bookId: z.string({ required_error: "BookId is required." }),
  review: z.string({ required_error: "Review is required." }),
});

export type createBookReviewInput = z.TypeOf<typeof createBookReview>;

export const createBookRating = z.object({
  userId: z.string({ required_error: "UserId is required." }),
  bookId: z.string({ required_error: "BookId is required." }),
  rating: z.number({ required_error: "Rating is required." }),
});
export type createBookRatingInput = z.TypeOf<typeof createBookRating>;
export type CreateBookInput = z.TypeOf<typeof validateBookSchema>;