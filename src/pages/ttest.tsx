import {
  Accordion,
  Button,
  Card,
  Center,
  clsx,
  Group,
  LoadingOverlay,
  Pagination,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { CreateBookInput, validateBookSchema } from "../schema/book.schema";
import { onPromise } from "../utils/promise-wrapper";
import { trpc } from "../utils/trpc";
import FormInput from "./book/upload/components/formInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaBook, FaEdit, FaUpload } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { UploadResponse } from "./api/upload";
import { BookSearch, Item } from "./test";
import { getThemeColor } from "../utils/themeBuilder";
function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
async function uploadFile(files: FileList): Promise<UploadResponse> {
  const formData = new FormData();
  Object.values(files).forEach((file) => {
    formData.append("file", file);
  });
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const body = (await response.json()) as UploadResponse;

  if (body.status === 200) {
    return body;
  }

  return body;
}

function BuddyRead() {
  const [activePage, setPage] = useState(1);
  const [bookArray, setBookArray] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const theme = useMantineTheme();
  const [accordion, setAccordion] = useState<string | null>("Google");
  const searchBook = async (bookName: string) => {
    if (!bookName) return;
    setBookArray([]);
    setSearchLoading(true);
    try {
      await api<BookSearch>(
        `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyDW5QZg-yWOm2ptT3o4aoqD-ozGBa9011c`
      ).then((data) => {
        if (data && data.items && data.items.length > 1) {
          setPage(1);
          setBookArray(data.items);
          setSearchLoading(false);
        }
      });
    } catch (error) {
      setSearchLoading(false);
      showNotification({
        id: "hello-there",
        disallowClose: true,
        onClose: () => console.log("unmounted"),
        onOpen: () => console.log("mounted"),
        autoClose: 5000,
        title: "Error:",
        message: "Wait a couple of seconds and try again",
        // color: "red",
        className: "my-notification-class",
        style: { backgroundColor: "white" },
        // sx: { backgroundColor: "red" },
        loading: false,
      });
    }
  };
  const themeIsLight = () => {
    return theme.colorScheme === "light";
  };
  ////
  //
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(validateBookSchema),
  });

  
  const [bookDownloadType, setBookDownloadType] = useState("url");
  const { mutate, error } = trpc.useMutation(["books.create-book"], {
    onSuccess: () => {
      //setIsLoading(false);
    },
    onError: (err) => {
      console.log(err);
      //setIsLoading(false);
    },
  });
  useEffect(() => {
    reset({ ownerId: session?.user?.id, hostedLink: "", image: "" });
    return () => {
      reset({ ownerId: session?.user?.id, hostedLink: "", image: "" });
    };
  }, [session, reset]);

  const fillFormData = () => {
    const book = bookArray[activePage - 1];
    if (!book) return;
    const bookData = book.volumeInfo;
    reset({
      ownerId: session?.user?.id,
      title: bookData.title,
      author: bookData.authors.join(", "),
      image: bookArray[activePage]?.volumeInfo.imageLinks.thumbnail,
      description: bookData.description ? bookData.description : "",
    });
    setAccordion("Data");
  };

  const onSubmit = async (values: CreateBookInput) => {
    /* Prevent form from submitting by default */
    // e.preventDefault();
    ///mutate(values);
    //setIsLoading(true);

    if (
      (values.image as FileList).length ||
      (values.hostedLink as FileList).length
    ) {
      if (values.hostedLink as FileList) {
        values.hostedLink = (
          await uploadFile(values.hostedLink as FileList)
        ).files.toString();
      }
      if ((values.image as FileList).length) {
        values.image = (
          await uploadFile(values.image as FileList)
        ).files.toString();
      }

      /* Send request to our api route */
    } else {
      delete values.image;
      delete values.hostedLink;
    }

    mutate(values);
  };

  ///
  return (
    <>
      <Card shadow="sm" p="sm" radius="md" withBorder>
        <Title size={"sm"}>Add a book:</Title>
        <Accordion
          value={accordion}
          onChange={setAccordion}
          styles={{
            control: {
              "&[data-active]": {
                borderBottom: "1px dashed #eaeaea",
              },
            },
          }}
        >
          <Accordion.Item value="Google">
            <Accordion.Control icon={<FaBook color={getThemeColor(theme.colorScheme)} className="text-lavender" />}>
              From Google Books
            </Accordion.Control>
            <Accordion.Panel>
              <Group spacing="xs">
                <TextInput
                  onKeyDown={(e) => {
                    e.key === "Enter" && searchBook(searchText);
                  }}
                  onChange={(input) => setSearchText(input.target.value)}
                  styles={() => ({
                    root: {
                      flex: "1 !important",
                    },
                  })}
                  placeholder="Search for a book"
                  radius="md"
                  size="sm"
                />
                <Button onClick={() => void searchBook(searchText)} size="sm">
                  Search
                </Button>
              </Group>
              <Center pt={8}>
                <Stack align={"center"}>
                  {bookArray.length < 1 && !searchLoading ? (
                    <>
                      <div
                        style={{ height: 150 }}
                        className="flex flex-col items-center justify-center gap-4 pt-4"
                      >
                        <GiMagnifyingGlass
                        color={getThemeColor(theme.colorScheme)}
                          className="text-4xl"
                        />
                        <Text color="dimmed" lineClamp={1} size="sm">
                          Search for a Book
                        </Text>
                      </div>
                    </>
                  ) : (
                    <>
                      <LoadingOverlay visible={searchLoading} overlayBlur={2} />
                      {(bookArray[activePage - 1]?.volumeInfo?.imageLinks
                        ?.thumbnail as string) ? (
                        <Image
                          objectFit={"contain"}
                          src={
                            bookArray[activePage - 1]?.volumeInfo.imageLinks
                              .thumbnail as string
                          }
                          width={100}
                          height={150}
                          alt="The cover of a book"
                        />
                      ) : (
                        <div
                          style={{ height: 150, width: 100 }}
                          className="flex flex-col items-center justify-center gap-4 pt-4 border-slate-200 border "
                        >
                          <GiMagnifyingGlass
                            className={clsx(
                              theme.colorScheme === "light" &&
                                `text-lavender text-4xl`
                            )}
                          />
                          <Text color="dimmed" lineClamp={1} size="sm">
                            No cover
                          </Text>
                        </div>
                      )}
                    </>
                  )}

                  <Button mt={-5} onClick={() => fillFormData()}>
                    Choose
                  </Button>
                  <Pagination
                    size={"sm"}
                    grow
                    page={activePage}
                    onChange={setPage}
                    total={bookArray.length - 1}
                  />
                </Stack>
              </Center>
            </Accordion.Panel>
          </Accordion.Item>
          <form
            className="space-y-2 flex flex-col h-full justify-between"
            onSubmit={onPromise(
              handleSubmit(onSubmit, (e) => {
                console.log(e);
              })
            )}
          >
            <Accordion.Item value="Data">
              <Accordion.Control
                icon={
                  <FaEdit color={getThemeColor(theme.colorScheme)} className={clsx(themeIsLight() && `text-lavender`)} />
                }
              >
                Add/Edit Book Data
              </Accordion.Control>
              <Accordion.Panel>
                <div className="space-y-1 mt-1 px-4">
                  <FormInput
                    id="bookTitle"
                    type="text"
                    placeholder="Book Title"
                    register={register("title", {
                      required: true,
                      minLength: 3,
                    })}
                    errors={errors.title}
                  />
                  <FormInput
                    id="bookAuthor"
                    type="text"
                    placeholder="Author"
                    register={register("author")}
                    errors={errors.author}
                  />
                  <FormInput
                    id="bookDescription"
                    type="textarea"
                    placeholder="Description"
                    register={register("description")}
                    errors={errors.description}
                  />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
            <div className="mt-1 px-4">
              <div className="section-upload pb-4 ">
                <div>
                  <label htmlFor="downloadLinkType">
                    <div className="flex items-center gap-3">
                      <FaUpload
                      color={getThemeColor(theme.colorScheme)}
                        className={clsx(themeIsLight() && `text-lavender`)}
                      />
                      Upload/Link:
                    </div>
                  </label>
                  <div className="flex justify-around pt-1">
                    <div className="flex gap-2 items-center">
                      <Radio
                        type="radio"
                        name="downloadLinkType"
                        checked={bookDownloadType === "url"}
                        onChange={() => setBookDownloadType("url")}
                        value="link"
                      />
                      <span>Url Link</span>
                    </div>
                    <div className="flex gap-2">
                      <Radio
                        type="radio"
                        name="downloadLinkType"
                        onChange={() => setBookDownloadType("upload")}
                        value="link"
                      />
                      <span>Upload FIle</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  {bookDownloadType === "upload" && (
                    <FormInput
                      type="file"
                      accept=".doc,.pdf,.epub"
                      register={register("hostedLink")}
                      errors={errors.hostedLink}
                    />
                  )}
                  {bookDownloadType === "url" && (
                    <FormInput
                      type="text"
                      placeholder="https://www.example.com/book.pdf"
                      register={register("externalLink")}
                      errors={errors.externalLink}
                    />
                  )}
                </div>
              </div>
              <Group grow>
                <Button type="submit">Create</Button>
                <Button type="submit" variant="outline">
                  Cancel
                </Button>
              </Group>
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error.message}
                </p>
              )}
            </div>
          </form>
        </Accordion>
      </Card>
    </>
  );
}
export default BuddyRead;
