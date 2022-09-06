// import { CustomUser, ReadingProgress } from "@prisma/client";
// import { Comment, CommentWithChildren } from "../utils/trpc";

// function formComments(
//   comments: Array<Comment>,
//   bookId: string,
//   userData?:
//     | (CustomUser & { ReadingProgress: ReadingProgress[] })
//     | null
//     | undefined
// ) {
//   const userReadingProgress =
//     userData?.ReadingProgress.find((book) => book.bookId === bookId)
//       ?.pagesRead || 0;
//   const map = new Map();

//   const roots: Array<CommentWithChildren> = [];

//   for (let i = 0; i < comments.length; i++) {
//     const commentId = comments[i]?.id;

//     map.set(commentId, i);

//     (comments[i] as CommentWithChildren).children = [];

//     if (typeof comments[i]?.parentId === "string") {
//       const parentCommentIndex: number = map.get(
//         comments[i]?.parentId
//       ) as number;

//       (comments[parentCommentIndex] as CommentWithChildren).children.push(
//         comments[i] as CommentWithChildren
//       );

//       continue;
//     }

//     if (
//       comments[i]?.readingProgress ||
//       (0 <= userReadingProgress && !comments[i]?.parentId)
//     ) {
//       roots.push(comments[i] as CommentWithChildren);
//     } else if (comments[i]?.parentId || comments[i]?.userId === userData?.id) {
//       roots.push(comments[i] as CommentWithChildren);
//     }
//   }

//   return roots;
// }

// export default formComments;
import { Comment, CommentWithChildren } from "../utils/trpc";

function formComments(comments: Array<Comment>) {
  const map = new Map();

  const roots: Array<CommentWithChildren> = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    (comments[i] as CommentWithChildren).children = [];

    if (typeof comments[i]?.parentId === "string") {
      const parentCommentIndex: number = map.get(comments[i]?.parentId) as number;

      (comments[parentCommentIndex] as CommentWithChildren).children.push(
        comments[i] as CommentWithChildren
      );

      continue;
    }

    roots.push(comments[i] as CommentWithChildren);
  }

  return roots;
}

export default formComments;
