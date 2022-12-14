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
import { Dispatch, SetStateAction, useState } from "react";
import {
  getThemeBackgroundColor,
  getThemeColor,
} from "../../utils/themeBuilder";
import { CommentWithChildren } from "../../utils/trpc";
import CommentForm from "./CommentForm";

function CommentActions({
  commentId,
  replyCount,
  useOpened,
}: {
  commentId: string;
  replyCount: number;
  // useReplies: [value:boolean, set:(value: boolean) => void];
  useOpened: {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
  };
  // useReplies: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const [replying, setReplying] = useState(false);
  // const [showReplies, setShowReplies] = useReplies;
  const theme = useMantineTheme();
  return (
    <>
      <Group position="apart" mt="md" mb={5}>
        {replyCount > 0 ? (
          <Text
            size={"xs"}
            className="cursor-pointer"
            color={getThemeColor(theme.colorScheme)}
            underline
            onClick={() => useOpened.setOpened(!useOpened.opened)}
          >
            {`Show replies(${replyCount})`}
          </Text>
        ) : (
          <div></div>
        )}

        <Button
          size="xs"
          mr="xs"
          variant="outline"
          compact
          onClick={() => {
            useOpened.setOpened(!replying);
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
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  return (
    <>
      <Paper
        withBorder
        radius="md"
        mb={comment.children ? "xs" : "md"}
        sx={(theme) => ({
          position: "relative",
          paddingLeft: "0.5rem",
          marginRight: -1,
          overflow: "hidden",
          "&:before": {
            content: '""',
            backgroundColor: getThemeBackgroundColor(theme.colorScheme),
            height: "1.5rem",
            width: "100%",
            position: "absolute",
            left: 0,
          },
        })}
      >
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
              flexDirection: "column",
            })}
          >
            <Group
              position="apart"
              sx={() => ({ zIndex: 1, marginLeft: "-10px" })}
            >
              <Text
                size={"sm"}
                weight="bolder"
                transform="capitalize"
                color={theme.colorScheme == "light" ? "white" : ""}
              >
                {comment.user.username}
              </Text>
              <Text size={"sm"} pr={"xs"} color={theme.colorScheme == "light" ? "white" : ""}>
                {comment.createdAt.toLocaleString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Text>
            </Group>
            <TypographyStylesProvider>
              <Text pr={"xs"} pt={5}>
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
          useOpened={{ opened, setOpened }}
        />
        {comment.children && comment.children.length > 0 && (
          <Collapse in={opened}>
            <ListComments comments={comment.children} />
          </Collapse>
        )}
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
