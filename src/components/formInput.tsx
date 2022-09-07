import { Textarea, TextInput } from "@mantine/core";
import { FunctionComponent, InputHTMLAttributes } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";

export type HookForm = {
  id?: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  label?: string;
  accept?: string;
  register: UseFormRegisterReturn;
  errors?: FieldError | Merge<FieldError, FieldErrorsImpl>;
};
const FormInput: FunctionComponent<HookForm> = ({
  id,
  type,
  placeholder,
  label,
  accept,
  register,
  errors,
}: HookForm) => (
  <>
    {type === "textarea" ? (
      <Textarea
        error={errors ? (errors.message as string) : ""}
        placeholder={placeholder}
        autoComplete="off"
        id={id}
        {...register}
      />
    ) : (
      <TextInput
      label={label}
        error={errors ? (errors.message as string) : ""}
        autoComplete="off"
        id={id}
        size="sm"
        styles={
          type === "file"
            ? {
                input: {
                  border: "none",
                },
              }
            : {}
        }
        type={type}
        accept={accept}
        placeholder={placeholder}
        {...register}
      />
    )}
  </>
);
export default FormInput;
