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
import {
  readingProgressInput,
  readingProgressSchema,
} from "../../schema/readingProgress.schema";
import { getThemeColor } from "../../utils/themeBuilder";
import { trpc } from "../../utils/trpc";
import FormInput from "./upload/components/formInput";

function SinglePostPage() {
  const router = useRouter();
  // const {data:session} = useSession();
  const [bookId, setBookId] = useState("");
  const [fullyRead, _setFullyRead] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (router.isReady) {
      setBookId(router.query.bookId as string);
    }
  }, [router.isReady, router.query.bookId]);

  const { data, isLoading } = trpc.useQuery(
    ["books.get-single-book", { bookId }],
    { enabled: true }
  );

  const { register } = useForm<readingProgressInput>({
    resolver: zodResolver(readingProgressSchema),
  });

  if (isLoading || bookId === "") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }
  console.log(data);
  // setFullyRead(data.ReadingProgress[0]?.fullyRead as boolean);
  return (
    <>
      <Modal
        centered
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Update your reading progress"
      >
        <FormInput type={"text"} register={register("pagesRead")} />
        <Group pt={15} grow>
          <Button>Save</Button>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <Card shadow="sm" p="sm" radius="md" withBorder>
        <Stack>
          <Title align="center" size={"sm"} pb={8}>
            {data.title}
          </Title>
          <Center>
            <Group>
              {data.image ? (
                <Image
                  objectFit={"contain"}
                  src={data.image}
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
              <Stack justify="space-between" spacing="lg" align="stretch">
                <Group align={"center"} grow>
                  <div>
                    <Text size="sm" weight="bold">
                      Pages read
                    </Text>
                    <Text size="sm" weight="bold">
                      0 pages
                    </Text>
                  </div>
                  <Button onClick={() => setShowModal(true)}>Update</Button>
                </Group>
                <Select
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
            <Textarea readOnly value={data.description?.toString()} />
          </Collapse>
        </Stack>
      </Card>
    </>
    // <div>
    //   <h1>{data?.title}</h1>
    //   <p>{data?.description}</p>
    // </div>
  );
}

export default SinglePostPage;
