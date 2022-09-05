import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Center,
  Collapse,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import Error from "next/error";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaBook } from "react-icons/fa";
import CommentForm from "../../components/comment/CommentForm";
import ListComments from "../../components/comment/ListComments";
import formComments from "../../helpers/formatComments";
import {
  readingProgressInput,
  readingProgressSchema,
} from "../../schema/readingProgress.schema";
import { onPromise } from "../../utils/promise-wrapper";
import { getThemeColor } from "../../utils/themeBuilder";
import { trpc } from "../../utils/trpc";
import FormInput from "../book/upload/components/formInput";

function SinglePostPage() {
  const router = useRouter();
  const [buddyReadId, setBuddyReadId] = useState("");
  const [fullyRead, setFullyRead] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (router.isReady) {
      setBuddyReadId(router.query.buddyReadId as string);
    }
  }, [router.isReady, router.query.buddyReadId]);

  const { data: userData } = trpc.useQuery(["users.get-self"]);

  const { data, isLoading } = trpc.useQuery(
    ["buddyreads.get-single-buddyread", { buddyReadId }],
    { enabled: true }
  );
  const { data: comments, isLoading: _commentsIsLoading } = trpc.useQuery([
    "comments.all-comments",
    { buddyReadId },
  ]);
  const utils = trpc.useContext();
  const { mutate, isLoading: _isUpdatingUser } = trpc.useMutation(
    "users.update-self-readingprogress",
    {
      onSuccess: async () => {
        await utils.invalidateQueries(["users.get-self"]);
        await utils.invalidateQueries([
          "buddyreads.get-single-buddyread",
          { buddyReadId },
        ]);
        setShowModal(false)
      },
      
    }
  );


  useEffect(() => {
    setReadingProgress(
      userData?.ReadingProgress.find((book) => book.bookId === data?.bookId)
        ?.pagesRead || 0
    );
    const currentFullyRead =
      userData?.ReadingProgress.find((book) => book.bookId === data?.bookId)
        ?.fullyRead || false;
    setFullyRead(currentFullyRead);
    reset({
      fullyRead: currentFullyRead,
    });
  }, [data]);
  

  const {
    handleSubmit,
    register,
    reset,
    // formState: { errors },
  } = useForm<readingProgressInput>({
    resolver: zodResolver(readingProgressSchema),
  });
  const onSubmit =  (values: readingProgressInput) => {
    const payload = {
      bookId: data?.bookId,
      fullyRead: values.fullyRead,
      pagesRead: values.pagesRead,
    };
    mutate(payload);
  };

  if (isLoading || buddyReadId === "") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <>
      <Modal
        centered
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Update your reading progress"
      >
        <form
          onSubmit={onPromise(handleSubmit(onSubmit, (e) => {
            console.log(e);
          }))}
        >
          <FormInput
            type={"number"}
            register={register("pagesRead", {
              valueAsNumber: true,
            })}
          />
          <Group pt={15} grow>
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
      <Card shadow="sm" p="sm" radius="md" withBorder>
        <Stack>
          <Title align="center" size={"sm"} pb={8}>
            {data.book.title}
          </Title>
          <Center>
            <Group>
              {data.book.image ? (
                <Image
                  objectFit={"contain"}
                  src={data.book.image}
                  width={100}
                  height={150}
                  alt="The cover of a book"
                />
              ) : (
                <div
                  style={{ height: 150, width: 100 }}
                  className="flex flex-col items-center justify-center gap-4 pt-4 border-slate-200 border "
                >
                  <FaBook
                    color={getThemeColor(theme.colorScheme)}
                    className="text-4xl"
                  />
                  <Text color="dimmed" lineClamp={1} size="sm">
                    No cover
                  </Text>
                </div>
              )}
              <Stack justify="space-between" spacing="lg">
                <Select
                  mb={"md"}
                  size="sm"
                  label="Status"
                  color={getThemeColor(theme.colorScheme)}
                  data={[
                    { value: "reading", label: "Reading" },
                    { value: "read", label: "Read" },
                  ]}
                  defaultValue={fullyRead ? "read" : "reading"}
                  dropdownPosition="bottom"
                />
                <Group grow>
                  <div>
                    <Text size="sm" weight="bold">
                      Pages read
                    </Text>
                    <Text size="sm" weight="bold">
                      {`${readingProgress.toString()} pages`}
                    </Text>
                  </div>
                  <Button onClick={() => setShowModal(true)}>Update</Button>
                </Group>
              </Stack>
            </Group>
          </Center>
          <Button
            fullWidth
            onClick={() => setShowDescription((value) => !value)}
          >
            Book Description
          </Button>
          <Collapse in={showDescription}>
            <Textarea readOnly value={data.book.description?.toString()} />
          </Collapse>
        </Stack>
      </Card>

      <Card p={"xs"} withBorder shadow={"sm"}>
        <CommentForm />
        {data && (
          <ListComments
            comments={formComments(comments || [], data.bookId, userData)}
          />
        )}
      </Card>
    </>
    // <div>
    //   <h1>{data?.title}</h1>
    //   <p>{data?.description}</p>
    // </div>
  );
}

export default SinglePostPage;
