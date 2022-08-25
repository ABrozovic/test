import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { CSSProperties, useEffect } from "react";
// import Error from "next/error";
import { Controller, useForm } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import {
  buddyReadSchema,
  CreateBuddyReadInput,
} from "../schema/buddyread.schema";
import { onPromise } from "../utils/promise-wrapper";
import { trpc } from "../utils/trpc";

const CreateBuddyread = () => {
  const customControlStyles: CSSProperties = {
    color: "white",
    borderColor: "pink",
  };


  type OptionType = { value: string; label: string };
  const multiStyle: StylesConfig<OptionType, true> = {
    
    control: (provided, state) => {
      // const { selectProps } = state;
      // provided has CSSObject type
      // state has ControlProps type

      // return type is CSSObject which means this line will throw
      // error if uncommented
      // return false;

      return {
        ...provided,
        ...customControlStyles,
        color: state.isFocused ? "white" : "red",
        width: 200,
        border: 'none',
        borderRadius: 5,
      };
    },
    multiValueLabel: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition, color: "white" };
    },
    multiValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";

      return { ...provided, opacity, transition, background: "#f6d8ac", fontWeight: "bold",
      borderRadius: 8, };
    },
    menu: (provided) => ({
      ...provided,
      width: 200,      
      borderRadius: 5,
      padding: 10,
    }),
  };
  const singleStyle: StylesConfig<OptionType, false> = {
    menu: (provided) => ({
      ...provided,
      width: 200,
      padding: 20,
    }),
    control: (provided, state) => {
      // const { selectProps } = state;
      // provided has CSSObject type
      // state has ControlProps type

      // return type is CSSObject which means this line will throw
      // error if uncommented
      // return false;

      return {
        ...provided,
        ...customControlStyles,
        color: state.isFocused ? "white" : "red",
        width: 200,
        borderRadius: 5,
      };
    },

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";
      return { ...provided, opacity, transition    };
    },
    option: (provided) => {
      
      return { ...provided, borderRadius: 8, fontWeight:"bold",  ":hover": { background: "pink" }};
    }

  };
  const { data: session } = useSession();
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateBuddyReadInput>({
    resolver: zodResolver(buddyReadSchema),
  });
  useEffect(() => {
    reset({ users: [session?.user?.id] });
    return () => {
      reset({ users: [session?.user?.id] });
    };
  }, [session, reset]);

  const onSubmit = (values: CreateBuddyReadInput) => {
    console.log(values);
  };

  const { data, isLoading } = trpc.useQuery(["books.get-all-books"]);

  if (isLoading) {
    <Select options={[{ value: "", label: "Loading..." }]} />;
  }

  if (data) {
    return (
      <form
        className=" text-lg text-gray-600 "
        onSubmit={onPromise(
          handleSubmit(onSubmit, (e) => {
            console.log(e);
          })
        )}
      >
        {data.length < 1 ? (
          <a> Please create a book first.</a>
        ) : (
          <>
            <Select
              styles={singleStyle}
              onChange={(option) => {
                setValue("book", option ? option.value : "");
              }}
              options={data.map((book) => {
                return { value: book.id, label: book.title };
              })}
            />
            {errors.book ? (
              <p className="text-red-500 text-sm text-center">
                {errors.book.message as string}
              </p>
            ) : null}
            <Controller
              control={control}
              name="users"
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Select
                  styles={multiStyle}
                  isMulti={true}
                  options={data.map((book) => {
                    return { value: book.id, label: book.title };
                  })}
                  onChange={(val) => onChange(val.map(({ value }) => value))}
                />
              )}
            />
            {errors.users ? (
              <p className="text-red-500 text-sm text-center">
                {errors.users.message as string}
              </p>
            ) : null}
          </>
        )}
        <button
          className="inline-block bg-blue-500 px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out mb-4 w-full"
          type="submit"
          //   onClick={()=> {setValue("ownerId", "ffggf")}}
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          Create book
        </button>
      </form>
    );
  }
};
export default CreateBuddyread;
