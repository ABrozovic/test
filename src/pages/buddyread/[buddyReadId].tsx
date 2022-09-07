import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Center,
  Collapse,
  Group,
  Modal,
  ScrollArea,
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
import FormInput from "../../components/formInput";
import AppShellLoader from "../../components/apshell/loader";

function SinglePostPage() {
  const router = useRouter();
  const [buddyReadId, setBuddyReadId] = useState("");

  const [readingProgress, setReadingProgress] = useState({
    pagesRead: 0,
    fullyRead: true,
  });
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const theme = useMantineTheme();

  useEffect(() => {
    if (router.isReady) {
      setBuddyReadId(router.query.buddyReadId as string);
    }
  }, [router.isReady, router.query.buddyReadId]);
  const utils = trpc.useContext();

  const { data, isLoading } = trpc.useQuery(
    ["buddyreads.get-single-buddyread", { buddyReadId }],
    { enabled: true }
  );
  const { mutate } = trpc.useMutation("buddyreads.update-reading-progress", {
    onSuccess: async () => {
      await utils.invalidateQueries([
        "buddyreads.get-single-buddyread",
        { buddyReadId },
      ]);
      setShowModal(false);
    },
  });

  useEffect(() => {
    const currentReadingProgress = data?.user[0]?.ReadingProgress.find(
      (book) => book.bookId === data?.bookId
    );
    setReadingProgress({
      pagesRead: currentReadingProgress?.pagesRead ?? 0,
      fullyRead: currentReadingProgress?.fullyRead ?? true,
    });

    reset({
      fullyRead: readingProgress.fullyRead,
      bookId: data?.bookId,
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
  const onSubmit = (values: readingProgressInput) => {
    if (!data) return;
    const payload = {
      buddyReadId,
      progress: {
        bookId: data.bookId,
        fullyRead: readingProgress.fullyRead,
        pagesRead: values.pagesRead,
      },
    };
    mutate(payload);
  };

  if (isLoading || buddyReadId === "") {
    return <AppShellLoader/>
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
          onSubmit={onPromise(
            handleSubmit(onSubmit, (e) => {
              console.log(e);
            })
          )}
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
      <ScrollArea style={{ height: "calc(100vh - 70px)"}} >
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
                  onChange={(e) => {
                    setReadingProgress((prev) => ({
                      ...prev,
                      fullyRead: e === "read" ? true : false,
                    }));
                  }}
                  value={readingProgress.fullyRead ? "read" : "reading"}
                  data={[
                    { value: "reading", label: "Reading" },
                    { value: "read", label: "Read" },
                  ]}
                  dropdownPosition="bottom"
                />
                <Group grow>
                  <div>
                    <Text size="sm" weight="bold">
                      Pages read
                    </Text>
                    <Text size="sm" weight="bold">
                      {`${readingProgress.pagesRead} pages`}
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
        {data && <ListComments comments={formComments(data.comment || [])} />}
        {/* {data && (
          <ListComments
            comments={formComments(comments || [], data.bookId, userData)}
          />
        )} */}
      </Card>
      </ScrollArea>
    </>
    // <div>
    //   <h1>{data?.title}</h1>
    //   <p>{data?.description}</p>
    // </div>
  );
}

export default SinglePostPage;
