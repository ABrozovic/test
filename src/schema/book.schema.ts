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

export const createBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(3, "Title must be at least 3 characters."),
  author: z.string().optional(),
  description: z.string().optional(),
  image: z
    .any()

    .refine(
      (images: FileList | string) =>
        typeof images === "string" ||
        checkForValidExtensions(images, ACCEPTED_IMAGE_TYPES),
      ".jpg, .jpeg, .png, and .webp files are accepted."
    ),

  externalLink: z.string().optional().or(z.literal("")),
  hostedLink: z
    .any()
    .refine(
      (files: FileList | string) =>
        typeof files === "string" ||
        checkForValidExtensions(files, ACCEPTED_FILE_TYPES),
      { message: ` .pdf, .doc, and .epub files are accepted.` }
    )
    .refine(
      (files: FileList | string) =>
        typeof files === "string" || (files[0] as File).size <= MAX_FILE_SIZE,
      `Max file size is 100MB.`
    ),
  ownerId: z.string({ required_error: "OwnerId is required." }),
});

export const routerBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(3, "Title must be at least 3 characters."),
  author: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  externalLink: z.string().optional().or(z.literal("")),
  hostedLink: z.string().optional(),
  ownerId: z.string({ required_error: "OwnerId is required." }),
});

function checkForValidExtensions(
  files: FileList,
  extensions: string[]
): boolean {
  for (let i = 0; i < files.length; i++) {
    if (!extensions.includes((files[i] as File).type)) {      
      return false;
    }
  }
  return files.length > 0 ? true : false;
}

export type CreateBookInput = z.TypeOf<typeof createBookSchema>;

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
