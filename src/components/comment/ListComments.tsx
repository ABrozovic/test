import {
  Box,
  Button,
  Collapse,
  Group,
  Paper,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { getThemeColor } from "../../utils/themeBuilder";
import { CommentWithChildren } from "../../utils/trpc";
import CommentForm from "./CommentForm";
function getReplyCountText(count: number) {
  if (count === 0) {
    return "No replies";
  }

  if (count === 1) {
    return "1 reply";
  }

  return `${count} replies`;
}
function CommentActions({
  commentId,
  replyCount,
  useReplies,
}: {
  commentId: string;
  replyCount: number;
  useReplies: [value:boolean, set:(value: boolean) => void];
  // useReplies: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const [replying, setReplying] = useState(false);
  const [showReplies, setShowReplies] = useReplies;
  const theme = useMantineTheme();
  return (
    <>
      <Group position="apart" mt="md" mb={5}>
        <Text
          size={"xs"}
          className="cursor-pointer"
          color={getThemeColor(theme.colorScheme)}
          underline
          onClick={() => {
            setShowReplies(!showReplies);
            setReplying(false);
          }}
        >
          {getReplyCountText(replyCount)}
        </Text>
        <Button
          size="xs"
          mr="xs"
          variant="outline"
          compact
          onClick={() => {
            setShowReplies(!replying);
            setReplying(!replying);
          }}
        >
          Reply
        </Button>
      </Group>

      {replying && (
        <CommentForm parentId={commentId} setReplying={setReplying} />
      )}
    </>
  );
}

function Comment({ comment }: { comment: CommentWithChildren }) {
  const [showReplies, setShowReplies] = useState(false);
  return (
    <>
      <Paper
        withBorder
        radius="md"
        mb={comment.children ? "xs" : "md"}
        sx={() => ({
          // paddingTop: "1rem",
          // paddingBottom: "0.1rem",
          position: "relative",
          paddingLeft: "0.5rem",
          marginRight: -1,
          overflow: "hidden",
        })}
      >
        <Box
          sx={() => ({
            backgroundColor: "red",
            height: "1.5rem",
            width: "100%",
            position: "absolute",
            left: 0,
          })}
        ></Box>
        <Box
          sx={() => ({
            display: "flex",
          })}
        >
          <Box
            pl={"xs"}
            sx={() => ({
              width: "100%",
              display: "flex",
              backgroundColor: "white",
              flexDirection: "column",
            })}
          >
            <Group position="apart" sx={() => ({ zIndex: 1 })}>
              <Text size={"sm"} weight={"bold"}>
                {comment.user.username}
              </Text>
              <Text size={"sm"} pr={"xs"}>
                {comment.createdAt.toLocaleString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
            </Group>
            <TypographyStylesProvider>
              <Text pr={"xs"}>
                <div
                  className="w-full break-words"
                  dangerouslySetInnerHTML={{ __html: comment.message }}
                />
              </Text>
            </TypographyStylesProvider>
          </Box>
        </Box>

        <CommentActions
          commentId={comment.id}
          replyCount={comment.children.length}
          useReplies={[showReplies, setShowReplies]}
        />
        <Collapse in={showReplies}>
          {comment.children && comment.children.length > 0 && (
            <ListComments comments={comment.children} />
          )}
        </Collapse>
      </Paper>
    </>
  );
}

function ListComments({ comments }: { comments: Array<CommentWithChildren> }) {
  return (
    <Box>
      {comments.map((comment) => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </Box>
  );
}
export default ListComments;