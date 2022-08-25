import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { useForm } from "react-hook-form";
import { FaAngleLeft, FaAngleRight, FaChevronRight } from "react-icons/fa";
import { CreateBookInput, validateBookSchema } from "../schema/book.schema";
import { onPromise } from "../utils/promise-wrapper";
import { trpc } from "../utils/trpc";
import { UploadResponse } from "./api/upload";
import FormInput from "./book/upload/components/formInput";

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

function Test() {
  const [bookArray, setBookArray] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [accordionState, setAccordionState] = useState(true);
  const url =
    "https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=AIzaSyDW5QZg-yWOm2ptT3o4aoqD-ozGBa9011c";

  useEffect(() => {
    api<BookSearch>(url)
      .then((data) => {
        if (data && data.items && data.items.length > 1) {
          setBookArray(data.items);
          //   const book = (data.items[0] as Item).volumeInfo;
          //   useBook.setBook({
          //     id: 0,
          //     title: book.title,
          //     description: book.description ? book.description : "",
          //     author: book.authors,
          //     smallThumbnail: book.imageLinks.smallThumbnail,
          //     thumbnail: book.imageLinks.thumbnail,
          //   });
          console.log(data.items);
        }
        // console.log(useBook.book);
      })
      .catch((error) => {
        /* show error message */
        console.log(error);
      });
  }, []);
  const searchBook = async (bookName: string) => {
    if (!bookName) return;
    await api<BookSearch>(
      `https://www.googleapis.com/books/v1/volumes?q=${bookName}&key=AIzaSyDW5QZg-yWOm2ptT3o4aoqD-ozGBa9011c`
    ).then((data) => {
      if (data && data.items && data.items.length > 1) {
        setCurrentPage(1);
        setBookArray(data.items);
      }
    });
  };
  const changePage = (index: number) => {
    setCurrentPage(clamp(index, 1, bookArray.length - 1));
  };

  function clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }

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

  //const [ setIsLoading] = useLoading(false)
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
    const book = bookArray[currentPage - 1];
    if (!book) return;
    const bookData = book.volumeInfo;
    reset({
      ownerId: session?.user?.id,
      title: bookData.title,
      author: bookData.authors.join(", "),
      image: bookArray[currentPage]?.volumeInfo.imageLinks.thumbnail,
      description: bookData.description ? bookData.description : "",
    });
    toogleAccordionState();
  };
  const toogleAccordionState = () => {
    setAccordionState(!accordionState);
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

  //
  return (
    <section className="gradient-form bg-purple-100 p-1 min-h-[calc(100vh-4rem)]">
      <div className="flex justify-between text-gray-800  mt-1">
        <div className="bg-white shadow-lg rounded mx-2 w-[calc(100vw-1rem)] min-h-[calc(100vh-6rem)]">
          <div className=" font-semibold text-center  ">
            <Accordion preExpanded={[0]}>
              <AccordionItem
                key="0"
                uuid={0}
                dangerouslySetExpanded={accordionState}
              >
                <AccordionItemHeading
                  onClick={toogleAccordionState}
                  className="bg-lavender text-white text-sm rounded p-1 mb-2  border-white"
                >
                  <AccordionItemButton>
                    <div className="flex justify-between items-center">
                      <FaChevronRight className="text-2xl" />
                      <div>From Google Books</div>
                      <div></div>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel className="mt-1 px-4 overflow-scroll overflow-x-hidden text-base animate-fadeIn transition-all ease-in-out duration-200 ">
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="appearance-none bg-transparent border-none w-full text-gray-700 py-1 px-2 leading-tight focus:outline-none"
                      id="bookSearch"
                      placeholder="Search for a book"
                      onChange={(val) => setSearchText(val.target.value)}
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                      onClick={() => void searchBook(searchText)}
                    >
                      search
                    </button>
                  </div>
                  <div className="flex flex-col justify-center gap-2">
                    <div className="overflow-scroll overflow-x-hidden text-base h-6">
                      {bookArray[currentPage - 1]?.volumeInfo.title}
                    </div>

                    <Image
                      objectFit={"contain"}
                      src={
                        bookArray[currentPage - 1]?.volumeInfo.imageLinks
                          .thumbnail as string
                      }
                      width={100}
                      height={150}
                      alt="The cover of a book"
                    />
                    <button
                      onClick={() => fillFormData()}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-2"
                    >
                      Choose
                    </button>
                    <div className="flex gap-8 justify-center items-center mb-4">
                      {currentPage > 1 ? (
                        <FaAngleLeft
                          className="text-lavender text-2xl"
                          onClick={() => {
                            changePage(currentPage - 1);
                          }}
                        />
                      ) : (
                        <FaAngleLeft className="text-gray-200 text-2xl" />
                      )}
                      {currentPage}
                      {currentPage < bookArray.length - 1 ? (
                        <FaAngleRight
                          className="text-lavender text-2xl"
                          onClick={() => {
                            changePage(currentPage + 1);
                          }}
                        />
                      ) : (
                        <FaAngleRight className="text-gray-200 text-2xl" />
                      )}
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>
              <form
                className="space-y-2 flex flex-col h-full justify-between"
                onSubmit={onPromise(
                  handleSubmit(onSubmit, (e) => {
                    console.log(e);
                  })
                )}
              >
                <AccordionItem key={1} dangerouslySetExpanded={!accordionState}>
                  <AccordionItemHeading
                    onClick={toogleAccordionState}
                    className="bg-lavender text-white text-sm rounded p-1 mb-2 border-b-2 border-white"
                  >
                    <AccordionItemButton>
                      <div className="flex justify-between items-center">
                        <FaChevronRight className="text-2xl" />
                        <div>Add/Edit Book Data</div>
                        <div></div>
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel className=" overflow-scroll overflow-x-hidden text-base animate-fadeIn transition-all ease-in-out duration-200 ">
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
                  </AccordionItemPanel>
                </AccordionItem>
                <div className="mt-1 px-4">
                  <div className="section-upload pb-4 ">
                    <div>
                      <label htmlFor="downloadLinkType">Upload/Link:</label>
                      <div className="flex justify-around pt-1">
                        <div className="flex gap-2 items-center">
                          <input
                            type="radio"
                            name="downloadLinkType"
                            checked={bookDownloadType === "url"}
                            onChange={() => setBookDownloadType("url")}
                            value="link"
                          />
                          <span>Url Link</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="radio"
                            name="downloadLinkType"
                            onChange={() => setBookDownloadType("upload")}
                            value="link"
                          />
                          <span>Upload FIle</span>
                        </div>
                      </div>
                    </div>
                    <div>
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
                  <div className="flex justify-around items-center gap-2">
                    <button
                      className="inline-block bg-blue-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                      type="submit"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                    >
                      Create book
                    </button>
                    <button
                      className="inline-block bg-red-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                      type="submit"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                    >
                      Cancel
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm text-center">
                      {error.message}
                    </p>
                  )}
                </div>
              </form>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Test;

function api<T>(url: string): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

export interface BookSearch {
  kind: string;
  totalItems: number;
  items: Item[];
}

export interface Item {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo: SaleInfo;
  accessInfo: AccessInfo;
  searchInfo?: SearchInfo;
}

export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate: string;
  description?: string;
  industryIdentifiers: IndustryIdentifier[];
  readingModes: ReadingModes;
  pageCount: number;
  printType: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating: string;
  allowAnonLogging: boolean;
  contentVersion: string;
  panelizationSummary: PanelizationSummary;
  imageLinks: ImageLinks;
  language: string;
  previewLink: string;
  infoLink: string;
  canonicalVolumeLink: string;
}

export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface ImageLinks {
  smallThumbnail: string;
  thumbnail: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: ListPrice;
  retailPrice?: RetailPrice;
  buyLink?: string;
  offers?: Offer[];
}

export interface ListPrice {
  amount: number;
  currencyCode: string;
}

export interface RetailPrice {
  amount: number;
  currencyCode: string;
}

export interface Offer {
  finskyOfferType: number;
  listPrice: ListPrice2;
  retailPrice: RetailPrice2;
}

export interface ListPrice2 {
  amountInMicros: number;
  currencyCode: string;
}

export interface RetailPrice2 {
  amountInMicros: number;
  currencyCode: string;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Pdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
  downloadLink?: string;
}

export interface Pdf {
  isAvailable: boolean;
  downloadLink?: string;
}

export interface SearchInfo {
  textSnippet: string;
}
