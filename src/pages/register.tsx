//import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customUserAuthSchema, RegisterUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";
import { onPromise } from "../utils/promise-wrapper";

function RegisterPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(customUserAuthSchema),
  });
  //const router = useRouter();

  const { mutate, error } = trpc.useMutation(["users.register-user"], {
    onSuccess: () => {
       //router.push("/login");
    },
    onError: (err) => {
      return console.log(err);
    },
  });

  function onSubmit(values: RegisterUserInput) {
    mutate(values);
  }

  return (
    <section className="h-full gradient-form bg-gray-200 ">
      <div className="h-full ">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="block bg-white shadow-lg rounded-lg">
            <div className="px-4 md:px-0">
              <div className="md:p-12 md:mx-6">
                <h4 className="text-xl font-semibold mt-1 mb-8 pb-1 text-center">
                  User registration
                </h4>
                <form onSubmit={onPromise(handleSubmit(onSubmit))}>
                  <div className="mb-4">
                    <input
                      className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="userName"
                      type="text"
                      placeholder="Username"
                      {...register("username", {
                        required: true,
                        maxLength: 24,
                        minLength: 3,
                      })}
                    />
                    {errors.username?.message && (
                      <p className="text-red-500 text-sm text-center">
                        {errors.username?.message}
                      </p>
                    )}

                    <input
                      className="form-control mt-8 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      id="userPassword"
                      type="password"
                      placeholder="Password"
                      {...register("password", {
                        required: true,
                        maxLength: 24,
                        minLength: 4,
                      })}
                    />

                    {errors.password?.message && (
                      <p className="text-red-500 text-sm text-center">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <div className="text-center pt-1">
                    <button
                      className="inline-block bg-blue-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                      type="submit"
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                    >
                      Register
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
      </div>
    </section>
  );
}

export default RegisterPage;
