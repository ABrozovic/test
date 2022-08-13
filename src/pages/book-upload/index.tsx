import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreateBookInput, createBookSchema } from "../../schema/book.schema";
import { onPromise } from "../../utils/promise-wrapper";
import { trpc } from "../../utils/trpc";
import { UploadResponse } from "../api/upload";
import FormInput from "./components/formInput";

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
// const useLoading = (loading: boolean) => {
//   const [isLoading, setIsLoading] = React.useState(loading);
//   return [isLoading, setIsLoading] as const;
// }
const CreateBookPage: NextPage = () => {
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
  });

  //const [ setIsLoading] = useLoading(false)
  const [bookDownloadType, setBookDownloadType] = React.useState("url");
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
    }

    mutate(values);
    
  };

  return (
    <section className="gradient-form bg-purple-100 p-1 h-[calc(100vh-4rem)] ">
      <div className="flex justify-center text-gray-800  mt-1">
        <div className="bg-white shadow-lg rounded-lg ">
          <div className="px-4 md:px-0 ">
            <div className="md:p-12 md:mx-6 ">
              <h4 className="text-xl font-semibold mt-1 mb-4 pb-1 text-center  ">
                Book Creation
              </h4>
              <form
                className="space-y-6"
                
                onSubmit={onPromise(handleSubmit(onSubmit, (e) => {
                  
                  console.log(e);
                }))}
              >
                <div className="space-y-2">
                  <FormInput
                    label="Title"
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
                  <FormInput
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    register={register("image")}
                    errors={errors.image}
                  />
                  <div className="section-upload">
                    <div>
                      <label htmlFor="downloadLinkType">Upload a book:</label>
                      <div className="flex justify-around">
                        <div className="flex gap-2">
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
                </div>

                <div className="flex justify-around items-center gap-2">
                  <button
                    className="inline-block bg-blue-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                    type="submit"
                    //   onClick={()=> {setValue("ownerId", "ffggf")}}
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Create book
                  </button>
                  <button
                    className="inline-block bg-red-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                    type="submit"
                    //   onClick={()=> {setValue("ownerId", "ffggf")}}
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateBookPage;
