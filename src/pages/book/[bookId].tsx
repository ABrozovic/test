import Error from "next/error";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/trpc";

function SinglePostPage() {
  const router = useRouter();
  const [bookId, setBookId] = React.useState("");

  React.useEffect(() => {
    if (router.isReady) {
      setBookId(router.query.bookId as string);
    }
  }, [router.isReady, router.query.bookId]);

  const { data, isLoading } = trpc.useQuery(
    ["books.get-single-book", { bookId }],
    { enabled: true }
  );

  if (isLoading || bookId === "") {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <section className="gradient-form bg-purple-100 dark:bg-slate-300 p-1 h-[calc(100vh-4rem)]">
      <div className="flex justify-center text-gray-800  mt-1">
        <div className="bg-white shadow-lg rounded-lg w-5/6">
          <div className="px-4 md:px-0">
            <div className="md:p-12 md:mx-6 h-full">
              <h4 className="text-lg font-semibold mt-1 mb-1 pb-1 text-center">
                {data.title}
              </h4>
              {/* <div className="flex justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105"> */}

              {data.image ? (
                <div className="flex flex-col max-h-[calc(100vh-16rem)]">
                  <div className="relative h-screen w-full">
                    <Image
                      className="inset-0 object-scale-down "
                      src={`/uploads/images/${data.image}`}
                      alt={data.title}
                      layout="fill"
                    />
                  </div>
                  <div className="p-1"></div>
                  <div className=" w-full overflow-scroll overflow-x-hidden h-1/2 ">
                    {data.description} {data.description} {data.description}{" "}
                    {data.description}
                  </div>
                </div>
              ) : (
                <div className=" w-1/2 overflow-scroll overflow-x-hidden max-h-[calc(100vh-16rem)] ">
                  {data.description} {data.description} {data.description}{" "}
                  {data.description}
                </div>
              )}

              <div className="flex pt-4 justify-around items-center gap-2">
                <button
                  className="inline-block bg-blue-500 dark:bg-slate-500  px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                  type="submit"
                  //   onClick={()=> {setValue("ownerId", "ffggf")}}
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Download
                </button>
                <button
                  className="inline-block bg-green-400 dark:bg-gray-800 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
                  type="submit"
                  //   onClick={()=> {setValue("ownerId", "ffggf")}}
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                >
                  Discuss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    // <div>
    //   <h1>{data?.title}</h1>
    //   <p>{data?.description}</p>
    // </div>
  );
}

export default SinglePostPage;
