import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Group, NumberInput, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onPromise } from "../../utils/promise-wrapper";
import { trpc } from "../../utils/trpc";
import DynamicRichText from "../dynamicRichText";

function CommentsForm({
  parentId,
  setReplying,
}: {
  parentId?: string;
  setReplying?: (active: boolean) => void;
}) {
  const router = useRouter();
  const [buddyReadId, setBuddyReadId] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  useEffect(() => {
    if (router.isReady) {
      setBuddyReadId(router.query.buddyReadId as string);
    }
  }, [router.isReady, router.query.buddyReadId]);

  const commentSchema = z.object({
    comment: z.string(),
  });
  type commentType = z.infer<typeof commentSchema>;

  const { handleSubmit, setValue, reset } = useForm<commentType>({
    resolver: zodResolver(commentSchema),
  });

  function onSubmit(values: commentType) {
    if (values.comment.replace(/(<([^>]+)>)/gi, "").length < 1) {
      setError("Comment cannot be empty");
      return;
    }
    const payload = {
      body: values.comment,
      readingProgress: page,
      buddyReadId,
      parentId,
    };
    mutate(payload);
  }
  const utils = trpc.useContext();

  const { mutate, isLoading } = trpc.useMutation(["comments.add-comment"], {
    onSuccess: async () => {
      if (parentId) {
        if (setReplying) setReplying(false);
      }
      reset({
        comment: "",
      });
      setComment("");

      // await utils.invalidateQueries(["comments.all-comments", { buddyReadId }]);
      await utils.invalidateQueries(["buddyreads.get-single-buddyread", { buddyReadId }]);
    },
  });
  return (
    <>
      <Box mb={"md"} mt={parentId ? "xs" : "sm"}>
        <form
          onSubmit={onPromise(
            handleSubmit(onSubmit, (e) => {
              console.log(e);
            })
          )}
        >
          <DynamicRichText
            controls={[
              ["bold", "italic", "underline", "h3", "blockquote"],
              ["alignLeft", "alignCenter", "alignRight"],
              ["video", "link"],
            ]}
            styles={{
              toolbar: {
                padding: "0.3rem",
              },
            }}
            placeholder={parentId ?"Write a comment...":"Start a topic..."}
            value={comment}
            onChange={(e) => {
              setComment(e);
              setError("");
              setValue("comment", e);
            }}
          />
          <Group position="apart" align={"center"} mt={5}>
            <Group>
              <NumberInput
                size="xs"
                defaultValue={page}
                onChange={(val) => setPage(val ? val : 0)}
                sx={() => ({
                  width: "5rem",
                })}
              />
              <Text size="xs">{`Must have read ${page} pages `}</Text>
            </Group>
            <Button
              loading={isLoading}
              size="xs"
              type="submit"
              mr={parentId ? "xs" : "none"}
              compact={parentId ? true : false}
            >
              {parentId ? "Post Reply" : "Post"}
            </Button>
          </Group>
          <Text color={"red"} size="xs">
            {error ? "Can't post empty messages" : ""}
          </Text>
        </form>
      </Box>
    </>
  );
}

export default CommentsForm;
